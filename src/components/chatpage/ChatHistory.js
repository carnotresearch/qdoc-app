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
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import LoadingDots from "./LoadingDots";

const ChatHistory = ({ chat, index, outputLanguage, onSourceClick }) => {
  const [currentUtterance, setCurrentUtterance] = useState(null); // currently playing audio
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  // Split the answer into paragraphs and render each with a source button if applicable
  const renderAnswerWithSources = () => {
    if (!chat.bot) return null;
    
    const paragraphs = chat.bot.split('\n\n');
    
    return (
      <div className="answer-with-sources">
        {paragraphs.map((paragraph, pIndex) => {
          const source = chat.sources?.find(s => s.paragraphIndex === pIndex);
          
          return (
            <div key={pIndex} className="paragraph-container">
              <ReactMarkdown>{paragraph}</ReactMarkdown>
              {source && (
                <Button
                  onClick={() => onSourceClick(source)}
                  variant="outline-secondary"
                  size="sm"
                  className="source-button"
                >
                  <FontAwesomeIcon icon={faBookmark} /> Source
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
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
              renderAnswerWithSources()
            )}
          </span>
          {chat.ttsSupport &&
            (playingIndex === index ? (
              <>
                <Button
                  onClick={() => handleSpeechOutput(chat.bot, "pause", index)}
                  variant="link"
                >
                  <FontAwesomeIcon icon={faPause} />
                </Button>
                <Button
                  onClick={() => handleSpeechOutput(chat.bot, "restart", index)}
                  variant="link"
                >
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleSpeechOutput(chat.bot, "play", index)}
                variant="link"
              >
                <FontAwesomeIcon icon={faPlay} />
              </Button>
            ))}
          <Button
            onClick={() => handleCopy(chat.bot, index)}
            variant="link"
            style={{ fontSize: "1" }}
          >
            {copiedIndex === index ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faCopy} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
