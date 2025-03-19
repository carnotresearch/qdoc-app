import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FaPlay, FaStop, FaCopy, FaCheck, FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "../styles/cisce.css";

const Demo = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      text: "**Welcome to icarKno™ Chat.** \n\nI'm here to help you with your queries. Feel free to ask me anything!",
      sender: "bots",
      copied: false,
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [inputLanguage, setInputLanguage] = useState(23); // Default to English
  const [outputLanguage, setOutputLanguage] = useState(23); // Default to English
  const [audioPlaying, setAudioPlaying] = useState(false);
  const chatMessagesEndRef = useRef(null); // Reference to the end of the chat messages

  useEffect(() => {
    // Scroll to the bottom when the chatMessages array changes
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (userInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { text: userInput, sender: "users", copied: false },
      ]);
      setUserInput("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/demo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userInput,
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: data.answer, sender: "bots", copied: false },
        ]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }
    }
  };

  const playVoice = (text) => {
    if (audioPlaying) {
      speechSynthesis.cancel(); // Stop the current utterance completely
      setAudioPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = outputLanguage === 1 ? "hi-IN" : "en-US"; // Set language for voice output
    utterance.onend = () => {
      setAudioPlaying(false);
    };

    speechSynthesis.speak(utterance);
    setAudioPlaying(true);
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition(); // or window.SpeechRecognition
    recognition.lang = inputLanguage === 1 ? "hi-IN" : "en-US"; // Set language for voice input

    recognition.onresult = (event) => {
      setUserInput(event.results[0][0].transcript); // Set the recognized text as input
    };

    recognition.start();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setChatMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, copied: true } : msg
        )
      );
    });
  };

  return (
    <div className="chat-page">
      <div className="chatcontainer">
        <div className="chat-messages">
          {chatMessages.map((chatMessage, index) => (
            <div
              key={index}
              className={`chat-message ${
                chatMessage.sender === "bots" ? "bots" : "users"
              }`}
            >
              <div>
                {chatMessage.sender === "bots" ? (
                  <ReactMarkdown>{chatMessage.text}</ReactMarkdown>
                ) : (
                  chatMessage.text
                )}
              </div>
              <div className="message-actions">
                {chatMessage.sender === "bots" && (
                  <>
                    <button
                      className="play-button"
                      onClick={() => playVoice(chatMessage.text)}
                    >
                      {audioPlaying ? <FaStop /> : <FaPlay />}
                    </button>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(chatMessage.text, index)}
                    >
                      {chatMessage.copied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
            placeholder="Type a message..."
            className="chatinput"
          />
          <button className="voice-button" onClick={handleVoiceInput}>
            <FaMicrophone />
          </button>
          <button onClick={sendChatMessage} className="sendbutton">
            <IoSend />
          </button>
        </div>
      </div>
      <footer className="chat-footer">
        <p>
          Copyright © 2024{" "}
          <a
            href="https://carnotresearch.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Carnot Research
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Demo;
