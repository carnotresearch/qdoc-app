import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faRobot,
  faMicrophone,
  faPause,
  faPlay,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import FileViewer from "./FileViewer";
import "../styles/chatPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChatPage({
  submittedData,
  setSubmittedData,
  inputLanguage,
  outputLanguage,
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const navigate = useNavigate();
  const chatHistoryRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    if (!submittedData.files.length && !submittedData.urls.length) {
      navigate("/");
    }
  }, [submittedData, navigate]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      if (inputLanguage === "1") {
        recognition.current.lang = "hi-IN"; // hindi
      } else if (inputLanguage === "11") {
        recognition.current.lang = "mr-IN"; // marathi
      } else if (inputLanguage === "10") {
        recognition.current.lang = "bn-IN"; // bengali
      } else if (inputLanguage === "7") {
        recognition.current.lang = "ta-IN"; // tamil
      } else if (inputLanguage === "17") {
        recognition.current.lang = "te-IN"; // telugu
      } else if (inputLanguage === "3") {
        recognition.current.lang = "kn-IN"; // kannada
      } else if (inputLanguage === "21") {
        recognition.current.lang = "gu-IN"; // gujarati
      } else if (inputLanguage === "15") {
        recognition.current.lang = "ml-IN"; // malayalam
      }
      recognition.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMessage(finalTranscript || interimTranscript);
      };
      recognition.current.onend = () => {
        setRecognizing(false);
      };
    }
  }, [inputLanguage]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChatHistory([
        ...chatHistory,
        { user: message, bot: "Loading...", timestamp },
      ]);
      setMessage("");
      const token = sessionStorage.getItem("token");

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/ask`,
          {
            message,
            token,
            inputLanguage,
            outputLanguage,
          }
        );
        setChatHistory([
          ...chatHistory,
          { user: message, bot: response.data.answer, timestamp },
        ]);
      } catch (error) {
        console.error("There was an error!", error);
        setChatHistory([
          ...chatHistory,
          { user: message, bot: "Error! Kindly try again", timestamp },
        ]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recognition.current) {
      if (recognizing) {
        recognition.current.stop();
      }
    }
    setRecognizing(false);
    if (outputLanguage === "1" || outputLanguage === "23") {
      setShowPlayButton(true);
    }
    handleSendMessage();
  };

  const handleSpeechInput = () => {
    if (recognition.current) {
      if (recognizing) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
      setRecognizing(!recognizing);
    }
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

    if (action === "restart" || !currentUtterance) {
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
    } else if (action === "play") {
      window.speechSynthesis.resume();
      setPlayingIndex(index); // Set the playing state
    } else if (action === "pause") {
      window.speechSynthesis.pause();
      setPlayingIndex(null); // Reset playing state on pause
    }
  };

  const removeFile = (index) => {
    const newFiles = [...submittedData.files];
    newFiles.splice(index, 1);
    setSubmittedData({ ...submittedData, files: newFiles });
  };

  const removeUrl = (index) => {
    const newUrls = [...submittedData.urls];
    newUrls.splice(index, 1);
    setSubmittedData({ ...submittedData, urls: newUrls });
  };

  return (
    <Container fluid className="chat-container">
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Button
          variant="secondary"
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        {!sidebarCollapsed && (
          <Sidebar
            files={submittedData.files}
            urls={submittedData.urls}
            removeFile={removeFile}
            removeUrl={removeUrl}
          />
        )}
      </div>
      <FileViewer files={submittedData.files} />
      <div className="chat-content">
        <h2>QDoc by Carnot Research</h2>
        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.map((chat, index) => (
            <div key={index} className="message-wrapper">
              <div className="message user">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                <div className="message-box">
                  <span className="message-text">{chat.user}</span>
                  <span className="message-time">{chat.timestamp}</span>
                </div>
              </div>
              <div className="message bot">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faRobot} className="icon" />
                </div>
                <div className="message-box">
                  <span className="message-text">{chat.bot}</span>
                  {showPlayButton &&
                    (playingIndex === index ? (
                      <>
                        <Button
                          onClick={() =>
                            handleSpeechOutput(chat.bot, "pause", index)
                          }
                          variant="link"
                        >
                          <FontAwesomeIcon icon={faPause} />
                        </Button>
                        <Button
                          onClick={() =>
                            handleSpeechOutput(chat.bot, "restart", index)
                          }
                          variant="link"
                        >
                          <FontAwesomeIcon icon={faRedo} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() =>
                            handleSpeechOutput(chat.bot, "play", index)
                          }
                          variant="link"
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </Button>
                        {currentUtterance && playingIndex === null && (
                          <Button
                            onClick={() =>
                              handleSpeechOutput(chat.bot, "restart", index)
                            }
                            variant="link"
                          >
                            <FontAwesomeIcon icon={faRedo} />
                          </Button>
                        )}
                      </>
                    ))}
                  <span className="message-time">{chat.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Form className="d-flex" onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <Button
            variant={recognizing ? "danger" : "primary"}
            onClick={handleSpeechInput}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </Button>
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </Container>
  );
}

export default ChatPage;
