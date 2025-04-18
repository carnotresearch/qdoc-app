import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faRedo,
  faCopy,
  faCheck,
  faFileAlt,
  faBookmark
} from "@fortawesome/free-solid-svg-icons";
import LoadingDots from "./LoadingDots";
import { usePageView } from "../PageViewContext";
import SuggestedQuestions from "./SuggestedQuestions";

// Simple and clean reference styles
const styles = {
  referencesWrapper: {
    marginTop: "10px",
    marginBottom: "5px",
  },
  referenceLabel: {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#555",
    textAlign: "left",
  },
  referencesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  referenceItem: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    backgroundColor: "rgba(38, 128, 128, 0.08)",
    borderLeft: "2px solid #268080",
    borderRadius: "0px 3px 3px 0px",
    fontSize: "13px",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.15s ease",
    color: "#333333",
    textAlign: "left",
  },
  referenceItemHover: {
    backgroundColor: "rgba(38, 128, 128, 0.2)",
  },
  referenceIcon: {
    width: "12px",
    marginRight: "8px",
    color: "#268080",
  },
  filename: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "150px",
  },
  pageInfo: {
    marginLeft: "8px",
    color: "#268080",
    fontWeight: "500",
  },
  suggestedQuestionsContainer: {
    marginTop: "15px",
    borderTop: "1px solid rgba(0,0,0,0.05)",
    paddingTop: "12px",
  }
};

const ChatHistory = ({ chat, index, outputLanguage, loadSessionDocument, onQuestionSelect }) => {
  const [currentUtterance, setCurrentUtterance] = useState(null); // currently playing audio
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { viewPage } = usePageView();
  const [hoveredReference, setHoveredReference] = useState(null);

  // copy message to clipboard
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    });
  };

  const handleSpeechOutput = (text, action, index) => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (outputLanguage === "1") {
      selectedVoice = voices.find((voice) => voice.lang === "hi-IN");
    }

    const lastPlayedIndex = sessionStorage.getItem("lastPlayedIndex");
    if (action === "pause") {
      window.speechSynthesis.pause();
      setPlayingIndex(null); // Reset playing state on pause
    } else if (
      action === "restart" ||
      !currentUtterance ||
      index !== lastPlayedIndex
    ) {
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.onend = () => {
        setCurrentUtterance(null);
        setPlayingIndex(null); // Reset playing state on end
      };
      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
      setPlayingIndex(index); // Set the playing state
      sessionStorage.setItem("lastPlayedIndex", index);
    } else if (action === "play") {
      window.speechSynthesis.resume();
      setPlayingIndex(index); // Set the playing state
    }
  };

  // Handle viewing a specific page in a PDF
  const handleViewPage = async (filename, pageNo) => {
    // Check if the file is a PDF by looking at the extension
    const fileExtension = filename.split('.').pop().toLowerCase();
    
    // If filename is different than current file, load it first
    if (filename !== sessionStorage.getItem("currentFile")) {
      await loadSessionDocument(sessionStorage.getItem("sessionId"), filename);
    } else {
      // If on mobile, manually trigger tab switch since loadSessionDocument won't run
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Set mobile view to file
        const event = new CustomEvent('switchToFileView');
        window.dispatchEvent(event);
      }
    }
    
    // Use viewPage from context to navigate to specific page
    // Add a longer delay to ensure file viewer is visible and document is rendered
    setTimeout(() => {
      viewPage(filename, pageNo);

      // Scroll to the file viewer area
      const fileViewer = document.querySelector(".file-viewer");
      if (fileViewer) {
        fileViewer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300); // Increased delay to allow file viewer to render
  };

  // Get sources from the chat message
  const getSources = () => {
    console.log("Sources from backend:", chat.sources);
    console.log("Standalone fileName from backend:", chat.fileName);
    console.log("Standalone pageNo from backend:", chat.pageNo);
    
    // Check if sources array exists and has items
    if (chat.sources && Array.isArray(chat.sources) && chat.sources.length > 0) {
      console.log("Using sources array:", chat.sources);
      return chat.sources;
    }
    
    return [];
  };

  // Function to truncate long filenames
  const truncateFilename = (filename, maxLength = 20) => {
    if (!filename) return "Document";
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.includes('.') ? filename.split('.').pop() : '';
    const nameWithoutExt = filename.includes('.') ? 
      filename.substring(0, filename.lastIndexOf('.')) : 
      filename;
    
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension ? extension.length + 1 : 0)) + '...';
    
    return extension ? `${truncatedName}.${extension}` : truncatedName;
  };

  // Handle suggested question click
  const handleQuestionClick = (question) => {
    onQuestionSelect(question);
  };

  return (
    <div key={index} className="message-wrapper">
      <div className="message user">
        <div className="message-box">
          <span className="message-text">
            <b>Your Query: </b>
            {chat.user}
          </span>
          <span className="message-time">{chat.timestamp}</span>
        </div>
      </div>
      <div className="message bot">
        <div className="message-box">
          <span className={"message-text"}>
            <b className="text-success">icarKno: </b>
            {chat.loading ? (
              <LoadingDots />
            ) : (
              <ReactMarkdown>{chat.bot}</ReactMarkdown>
            )}
          </span>
          
          {!chat.loading && (
            <>
              <div className="message-footer">
                {/* Reference section on the left */}
                <div className="reference-section">
                  {getSources().length > 0  && (
                    <div style={styles.referencesWrapper}>
                      <div style={styles.referenceLabel}>
                        References
                      </div>
                      <div style={styles.referencesList}>
                        {getSources().map((source, idx) => (
                          <div
                            key={idx}
                            style={{
                              ...styles.referenceItem,
                              ...(hoveredReference === idx ? styles.referenceItemHover : {})
                            }}
                            onClick={() => handleViewPage(source.fileName, source.pageNo)}
                            title={`View page ${source.pageNo} in ${source.fileName}`}
                            onMouseEnter={() => setHoveredReference(idx)}
                            onMouseLeave={() => setHoveredReference(null)}
                          >
                            <FontAwesomeIcon icon={faFileAlt} style={styles.referenceIcon} />
                            <span style={styles.filename}>
                              {truncateFilename(source.fileName)}
                            </span>
                            <span style={styles.pageInfo}>pg: {source.pageNo || 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Audio and copy controls - position based on whether references exist */}
                <div className="controls-section" style={{ 
                  marginLeft: getSources().length > 0 ? 'auto' : '0',
                  justifyContent: getSources().length > 0 ? 'flex-end' : 'flex-start',
                  marginRight: getSources().length > 0 ? '0' : 'auto'
                }}>
                  {chat.ttsSupport &&
                    (playingIndex === index ? (
                      <>
                        <Button
                          onClick={() => handleSpeechOutput(chat.bot, "pause", index)}
                          variant="link"
                          className="control-btn"
                        >
                          <FontAwesomeIcon icon={faPause} />
                        </Button>
                        <Button
                          onClick={() => handleSpeechOutput(chat.bot, "restart", index)}
                          variant="link"
                          className="control-btn"
                        >
                          <FontAwesomeIcon icon={faRedo} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleSpeechOutput(chat.bot, "play", index)}
                          variant="link"
                          className="control-btn"
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </Button>
                      </>
                    ))}
                  <Button
                    onClick={() => handleCopy(chat.bot, index)}
                    variant="link"
                    className="control-btn"
                  >
                    {copiedIndex === index ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faCopy} />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Suggested Questions section - moved outside of message-footer */}
              {chat.suggestedQuestions && chat.suggestedQuestions.length > 0 && (
                <div style={styles.suggestedQuestionsContainer}>
                  <SuggestedQuestions 
                    questions={chat.suggestedQuestions} 
                    onQuestionClick={handleQuestionClick} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;