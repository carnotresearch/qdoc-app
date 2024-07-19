import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
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

const sttSupportedLanguages = {
  23: "", // English
  1: "hi-IN", // Hindi
  11: "mr-IN", // Marathi
  10: "bn-IN", // Bengali
  7: "ta-IN", // Tamil
  17: "te-IN", // Telugu
  3: "kn-IN", // Kannada
  21: "gu-IN", // Gujarati
  15: "ml-IN", // Malayalam
};

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
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [pausedIndex, setPausedIndex] = useState(null); // Index of currently paused response
  const [showMicrophone, setShowMicrophone] = useState(true);
  const navigate = useNavigate();
  const chatHistoryRef = useRef(null);
  const recognition = useRef(null);
  const sttSupportedLanguagesRef = useRef(sttSupportedLanguages);
  const ttsSupportedLanguages = ["1", "23"];

  useEffect(() => {
    setShowMicrophone(
      sttSupportedLanguagesRef.current.hasOwnProperty(inputLanguage)
    );
  }, [inputLanguage]);

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

      if (sttSupportedLanguages[inputLanguage]) {
        recognition.current.lang =
          sttSupportedLanguagesRef.current[inputLanguage];
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

      const ttsSupport = ttsSupportedLanguages.includes(outputLanguage);
      const newChatHistory = [
        ...chatHistory,
        {
          user: message,
          bot: "Loading...",
          timestamp,
          ttsSupport,
        },
      ];

      setChatHistory(newChatHistory);
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

        newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
        setChatHistory([...newChatHistory]);
      } catch (error) {
        console.error("There was an error!", error);
        newChatHistory[newChatHistory.length - 1].bot =
          "Error! Kindly try again";
        setChatHistory([...newChatHistory]);
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
      setPausedIndex(playingIndex);
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
        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.map((chat, index) => (
            <div key={index} className="message-wrapper">
              <div className="message user">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                <div className="message-box">
                  <span className="message-text">
                    <b>Your Query: </b>
                    {chat.user}
                  </span>
                  <span className="message-time">{chat.timestamp}</span>
                </div>
              </div>
              <div className="message bot">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faRobot} className="icon" />
                </div>
                <div className="message-box">
                  <span className={"message-text"}>
                    <b className="text-success">Qdoc response: </b>
                    <ReactMarkdown>{chat.bot}</ReactMarkdown>
                  </span>
                  {chat.ttsSupport &&
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
                      <Button
                        onClick={() =>
                          handleSpeechOutput(
                            chat.bot,
                            pausedIndex === index ? "play" : "restart",
                            index
                          )
                        }
                        variant="link"
                      >
                        <FontAwesomeIcon icon={faPlay} />
                      </Button>
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
          {showMicrophone && (
            <Button
              variant={recognizing ? "danger" : "primary"}
              onClick={handleSpeechInput}
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </Button>
          )}
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </Container>
  );
}

export default ChatPage;
