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
} from "@fortawesome/free-solid-svg-icons";
import LoadingDots from "./LoadingDots";
import { usePageView } from "../PageViewContext";

const ChatHistory = ({ chat, index, outputLanguage, loadSessionDocument }) => {
  const [currentUtterance, setCurrentUtterance] = useState(null); // currently playing audio
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { viewPage } = usePageView();

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
    if (filename !== sessionStorage.getItem("currentFile")) {
      await loadSessionDocument(sessionStorage.getItem("sessionId"), filename);
    }
    // Add an artificial delay to ensure state updates are processed
    setTimeout(() => {
      viewPage(filename, pageNo);

      // Scroll to the file viewer area
      const fileViewer = document.querySelector(".file-viewer");
      if (fileViewer) {
        fileViewer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Get sources from the chat message
  const getSources = () => {
    // Check if sources array exists in chat
    if (chat.sources && Array.isArray(chat.sources) && chat.sources.length > 0) {
      return chat.sources;
    }
    
    // If no sources and not loading, return default test sources
    // if (!chat.loading) {
    //   return [
    //     { fileName: "kepy101.pdf", pageNo: 1 },
    //     { fileName: "kepy101.pdf", pageNo: 2 }
    //   ];
    // }
    
    return [];
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
            <div className="message-footer">
              {/* Reference page numbers on the left */}
              <div className="reference-section">
                {getSources().length > 0 && (
                  <>
                    <span className="reference-label">References:</span>
                    <div className="page-numbers">
                      {getSources().map((source, idx) => (
                        <button
                          key={idx}
                          className="page-number"
                          onClick={() => handleViewPage(source.fileName, source.pageNo)}
                          title={`View page ${source.pageNo} in ${source.fileName}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Audio and copy controls on the right */}
              <div className="controls-section">
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
                    <Button
                      onClick={() => handleSpeechOutput(chat.bot, "play", index)}
                      variant="link"
                      className="control-btn"
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
