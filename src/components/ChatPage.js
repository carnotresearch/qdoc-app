import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
// components
import { FileContext } from "./FileContext";
import { ttsSupportedLanguages } from "../constant/data";
import LoadingDots from "./chatpage/LoadingDots";
import FileViewer from "./chatpage/FileViewer";
import Sidebar from "./Sidebar";
// icons and style
import { FaChevronCircleLeft } from "react-icons/fa";
import { Button, Container } from "react-bootstrap";
import {
  faCheckCircle,
  faPause,
  faPlay,
  faRedo,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "../styles/chatPage.css";
import MessageInput from "./chatpage/MessageInput";

function ChatPage({ inputLanguage, outputLanguage, setIsLoggedIn }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null); // currently playing audio
  const [playingIndex, setPlayingIndex] = useState(null); // Index of currently playing response
  const [pausedIndex, setPausedIndex] = useState(null); // Index of currently paused response
  const chatHistoryRef = useRef(null);
  const messageInputRef = useRef(null);
  const { files, setFiles } = useContext(FileContext);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [latestSessionId, setLatestSessionId] = useState("");
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const [isScannedDocument, setIsScannedDocument] = useState(false);
  const navigate = useNavigate();
  const scannedDocumentWarning = (documentName) =>
    "Unfortunately we couldn't read document: '" +
    documentName +
    "', as it seems to be a scanned document. Kindly upload a readable document.";

  const fetchSessions = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
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
  }, []);
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // copy message to clipboard
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    });
  };

  // side bar open on large and collapsed on small screens
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

  // cursor on input query field when files are updated
  useEffect(() => {
    setIsFileUpdated(true);
    messageInputRef.current.focus();
    if (files.length > 0) {
      setSidebarCollapsed(true);
    }
  }, [files]);

  // auto scroll down to latest chat response
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (message) => {
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
      const token = sessionStorage.getItem("token");
      const context = files.length > 0 ? "files" : "";
      try {
        let temperature = 0.1;
        const context_mode = sessionStorage.getItem("answerMode");
        if (context_mode && context_mode === "creative") {
          temperature = 0.8;
        }

        if (isScannedDocument) {
          console.log(files);
          newChatHistory[newChatHistory.length - 1].bot =
            scannedDocumentWarning(files[0].name);
        } else {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/ask`,
            {
              sessionId: sessionStorage.getItem("sessionId"),
              message,
              token,
              inputLanguage,
              outputLanguage,
              context,
              temperature: temperature,
              mode: context_mode || "contextual",
            }
          );
          newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
        }
        newChatHistory[newChatHistory.length - 1].loading = false;
        setChatHistory([...newChatHistory]);
      } catch (error) {
        console.error("There was an error!", error);
        if (error.response && error.response.status === 401) {
          setFiles([]);
          alert("User session is expired!");
          setIsLoggedIn(false);
          navigate("/login");
        }
        newChatHistory[newChatHistory.length - 1].bot =
          "Couldn't fetch response, kindly reload the page.";
        newChatHistory[newChatHistory.length - 1].loading = false;
        setChatHistory([...newChatHistory]);
      }
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
        {!sidebarCollapsed && (
          <Sidebar
            sessions={sessions}
            setLatestSessionId={setLatestSessionId}
            latestSessionId={latestSessionId}
            selectedSessionFiles={selectedSessionFiles}
            setSelectedSessionFiles={setSelectedSessionFiles}
            setSessions={setSessions}
            setIsLoggedIn={setIsLoggedIn}
            setIsScannedDocument={setIsScannedDocument}
          />
        )}
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
                    {isScannedDocument
                      ? scannedDocumentWarning(files[0].name)
                      : "Your files have been uploaded!"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="message bot">
                <div className="message-box">
                  <span className={"message-text"}>
                    <p>
                      Kindly upload files using sidebar or Select an existing
                      knowledge container from the Left Menu.{" "}
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
        <MessageInput
          inputLanguage={inputLanguage}
          messageInputRef={messageInputRef}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </Container>
  );
}
export default ChatPage;
