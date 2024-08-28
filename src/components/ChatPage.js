import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaChevronCircleLeft } from "react-icons/fa";
import { Button, Container, Form } from "react-bootstrap";
import {
  faCheckCircle,
  faMicrophone,
  faPause,
  faPlay,
  faRedo,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import FileViewer from "./FileViewer";
import { FileContext } from "./FileContext";
import "../styles/chatPage.css";
import axios from "axios";
import LoadingDots from "./LoadingDots";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";

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

function ChatPage({ inputLanguage, outputLanguage }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [pausedIndex, setPausedIndex] = useState(null); // Index of currently paused response
  const [showMicrophone, setShowMicrophone] = useState(true);
  const chatHistoryRef = useRef(null);
  const recognition = useRef(null);
  const inputRef = useRef(null);
  const sttSupportedLanguagesRef = useRef(sttSupportedLanguages);
  const ttsSupportedLanguages = ["1", "23"];
  const { files, setFiles } = useContext(FileContext);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [latestSessionId, setLatestSessionId] = useState("");
  const token = sessionStorage.getItem("token");
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AWS_FETCH_SESSIONS}`,
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data.data;
      if (!data || !data.sessions || data.sessions.length === 0) {
        console.log("No sessions available.");
        return;
      }

      const sessionsData = data.sessions;

      const sessions = sessionsData.map((session) => ({
        id: session.session_id,
        timestamp: session.timestamp,
        fileNames: session.file_names,
        name: session.name,
      }));

      const files = sessionsData.reduce((acc, session) => {
        acc[session.session_id] = session.file_names.map((fileName) => ({
          name: fileName,
          size: 0,
        }));
        return acc;
      }, {});

      setSessions(sessions);
      setSelectedSessionFiles(files);
    } catch (error) {
      console.error("Error fetching sessions", error);
      alert("Error fetching sessions, please try again.");
    }
  };
  
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    });
  };

  useEffect(() => {
    setChatHistory([]);
    // initial state based on the screen size
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize();
    // event listener to handle window resize
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsFileUpdated(true);
    inputRef.current.focus();
    if (files.length > 0) {
      setSidebarCollapsed(true);
    }
  }, [files]);

  useEffect(() => {
    setShowMicrophone(
      sttSupportedLanguagesRef.current.hasOwnProperty(inputLanguage)
    );
  }, [inputLanguage]);

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
    setIsFileUpdated(false);
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
          bot: "",
          loading: true,
          timestamp,
          ttsSupport,
        },
      ];
      setChatHistory(newChatHistory);
      setMessage("");
      const token = sessionStorage.getItem("token");
      const context = files.length > 0 ? "files" : "";
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/ask`,
          {
            sessionId: sessionStorage.getItem("sessionId"),
            message,
            token,
            inputLanguage,
            outputLanguage,
            context,
          }
        );

        newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
        newChatHistory[newChatHistory.length - 1].loading = false;
        setChatHistory([...newChatHistory]);
      } catch (error) {
        console.error("There was an error!", error);
        if (error.response && error.response.status === 401) {
          setFiles([]);
          alert("User session is expired!");
          navigate("/login");
        }
        newChatHistory[newChatHistory.length - 1].bot =
          "Error! Kindly try again";
        newChatHistory[newChatHistory.length - 1].loading = false;
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

  const iconStyles = { color: "green", marginRight: "5px" };
  const startingQuestions = [
    "Summarise the document.",
    "Give me any five silent issues highlighted in the document.",
    "Explain one feature mentioned in the document.",
  ];

  return (
    <Container fluid className="chat-container">
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Button
          variant="secondary"
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <MenuOutlinedIcon className="menu-icon" fontSize="medium" />
        </Button>
        {!sidebarCollapsed && <Sidebar files={files} sessions={sessions} setLatestSessionId={setLatestSessionId} latestSessionId={latestSessionId} selectedSessionFiles={selectedSessionFiles} setSelectedSessionFiles={setSelectedSessionFiles} setSessions={setSessions} />}
      </div>
      <FileViewer files={files} />
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
          {chatHistory.map((chat, index) => (
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
          ))}
          {isFileUpdated &&
            (files.length > 0 ? (
              <div className="message bot">
                <div className="message-box">
                  <span className={"message-text"}>
                    <b className="text-success">icarKno: </b>
                    Your files have been uploaded!
                  </span>
                </div>
              </div>
            ) : (
              <div className="message bot">
                <div className="message-box">
                  <span className={"message-text"}>
                    <p>
                      Kindly upload files using sidebar.{" "}
                      <FaChevronCircleLeft
                        style={{ cursor: "pointer" }}
                        onClick={() => setSidebarCollapsed(false)}
                      />
                    </p>
                  </span>
                </div>
              </div>
            ))}
        </div>
        <Form className="d-flex" onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            id="query"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            ref={inputRef}
          />
          {showMicrophone && (
            <Button
              variant={recognizing ? "danger" : ""}
              onClick={handleSpeechInput}
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </Button>
          )}
          <IconButton
            type="submit"
            aria-label=""
            style={{ color: "rgba(54, 183, 183, 0.8)" }}
          >
            <SendIcon />
          </IconButton>
        </Form>
      </div>
    </Container>
  );
}
export default ChatPage;
