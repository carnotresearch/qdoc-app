import React, { useEffect, useRef, useState } from "react";
import ChatHistory from "../chatpage/ChatHistory";
import MessageInput from "../chatpage/MessageInput";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import "../../styles/chatContent.css";

function ChatContent({
  files,
  chatHistory,
  outputLanguage,
  inputLanguage,
  messageInputRef,
  handleSendMessage,
  isFileUpdated,
  handleInputFocus,
}) {
  const chatHistoryRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const iconStyles = { color: "green", marginRight: "5px" };
  const startingQuestions = [
    "Summarise the document.",
    "Give me any five silent issues highlighted in the document.",
    "Explain one feature mentioned in the document.",
  ];

  // auto scroll down to latest chat response
  useEffect(() => {
    if (
      chatHistory.length > 0 &&
      !chatHistory[chatHistory.length - 1]?.loading &&
      !chatHistory[chatHistory.length - 1]?.bot
    ) {
      setShowPopup(true);
    }
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Simple loadSessionDocument function for free trial mode
  const loadSessionDocument = (sessionId, fileName) => {
    // For free trial, we just log the reference click
    console.log(`Reference clicked in free trial mode: ${fileName}`);
    
    // If needed, we can still set the current file in session storage
    // but this is probably already set when uploading the file
    if (fileName) {
      sessionStorage.setItem("currentFile", fileName);
    }
    
    // Find the PDF viewer container and scroll to it
    const fileViewer = document.querySelector(".file-viewer");
    if (fileViewer) {
      fileViewer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="chat-content">
      <div className="chat-history" ref={chatHistoryRef}>
        <div className="message bot">
          <div className="message-box">
            <span className="message-text">
              <b>Welcome to icarKno-chat</b>
              <p style={{ marginBottom: "0" }}>
                icarKno-chat is a knowledge agent that allows you to query
                multiple documents in diverse languages.
              </p>
              {files.length > 0 && (
                <>
                  You can interact with the application by typing in questions
                  such as:
                  <ul className="custom-list">
                    {startingQuestions.map((question, index) => (
                      <li key={index}>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={iconStyles}
                        />
                        {question}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </span>
          </div>
        </div>
        {isFileUpdated && (
          <div className="message bot">
            <div className="message-box">
              <span className={"message-text"}>
                Your knowledge container is ready with file "{files[0].name}".
                Without login you can ask 10 questions. Login for Free to ask
                more questions.
              </span>
            </div>
          </div>
        )}
        {chatHistory.map((chat, index) => (
          <ChatHistory
            chat={chat}
            index={index}
            outputLanguage={outputLanguage}
            key={index}
            loadSessionDocument={loadSessionDocument}
          />
        ))}
      </div>
      <MessageInput
        inputLanguage={inputLanguage}
        messageInputRef={messageInputRef}
        handleSendMessage={handleSendMessage}
        handleInputFocus={handleInputFocus}
      />
      <Popup
        popupText={
          "You've reached the maximum limit to ask questions. Login for Free to continue."
        }
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    </div>
  );
}

export default ChatContent;