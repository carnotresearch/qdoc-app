import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// components
import { FileContext } from "./FileContext";
import { SourceContext } from "./SourceContext";
import { ttsSupportedLanguages } from "../constant/data";
import FileViewer from "./chatpage/FileViewer";
import Sidebar from "./Sidebar";
// icons and style
import { FaChevronCircleLeft } from "react-icons/fa";
import { Button, Container } from "react-bootstrap";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "../styles/chatPage.css";
import MessageInput from "./chatpage/MessageInput";
import ChatHistory from "./chatpage/ChatHistory";
import { handleDownloadChat } from "./utils/chatUtils";

function ChatPage({ inputLanguage, outputLanguage, setIsLoggedIn }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarRef = useRef(null); // Ref for the sidebar
  const chatHistoryRef = useRef(null);
  const messageInputRef = useRef(null);
  const { files, setFiles } = useContext(FileContext);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [latestSessionId, setLatestSessionId] = useState("");
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const [isScannedDocument, setIsScannedDocument] = useState(false);
  const navigate = useNavigate();
  const isMobileScreen = window.innerWidth <= 768;
  const scannedDocumentWarning = (documentName) =>
    `Unfortunately we couldn't read document: '${documentName}', as it seems to be a scanned document. Kindly upload a readable document.`;
  const { setActiveSource } = useContext(SourceContext);

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

  const handleOutsideClick = useCallback(
    (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !sidebarCollapsed // Only act if the sidebar is open
      ) {
        setSidebarCollapsed(true); // Collapse the sidebar
      }
    },
    [sidebarCollapsed]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    setChatHistory([]);
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Attach the event listener to detect outside clicks
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  useEffect(() => {
    setIsLoggedIn(true);
    setIsFileUpdated(true);
    messageInputRef.current.focus();
    if (files.length > 0) {
      setSidebarCollapsed(true);
    }
  }, [files , setIsLoggedIn]);

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
          sources: [], // Initialize sources array
        },
      ];
      setChatHistory(newChatHistory);
      const token = sessionStorage.getItem("token");
      const context = files.length > 0 ? "files" : "";

      const hasCsvOrXlsx =
        sessionStorage.getItem("currentSessionHasCsvOrXlsx") === "true";

      try {
        const context_mode = sessionStorage.getItem("answerMode");

        if (isScannedDocument) {
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
              mode: context_mode || "contextual",
              hasCsvOrXlsx,
            }
          );
          newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
          // Store sources if they exist in the response
          if (response.data.sources) {
            newChatHistory[newChatHistory.length - 1].sources = response.data.sources;
          }
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

  const downloadChat = () => {
    handleDownloadChat(chatHistory); // Call the function with chatHistory
  };

  const iconStyles = { color: "green", marginRight: "5px" };
  const startingQuestions = [
    "Summarise the document.",
    "Give me any five silent issues highlighted in the document.",
    "Explain one feature mentioned in the document.",
  ];

  function resizeMusedown(e) {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }

  function resize(e) {
    const container = document.getElementsByClassName('chat-container')[0];
    const containerOffsetLeft = container.offsetLeft;
    const newLeftWidth = e.clientX - containerOffsetLeft;
    const leftDiv = document.getElementsByClassName('file-viewer')[0];
    const rightDiv = document.getElementsByClassName('chat-content')[0];
    const resizer = document.getElementById('resizer');

    if (leftDiv) {
        leftDiv.style.width = newLeftWidth + 'px';
    }
    if (rightDiv && resizer) {
        rightDiv.style.width = (container.clientWidth - newLeftWidth - resizer.offsetWidth) + 'px';
    }
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

  // Handle source button click
  const handleSourceClick = (source) => {
    setActiveSource(source);
  };

  return (
    <Container fluid className={`chat-container ${isMobileScreen ? "mobile-screen" : ""}`}>
      <div
        ref={sidebarRef} // Attach the ref to the sidebar
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
      >
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
      <div id="resizer" onMouseDown={resizeMusedown}></div>
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
            <ChatHistory
              key={index}
              chat={chat}
              index={index}
              outputLanguage={outputLanguage}
              onSourceClick={handleSourceClick}
            />
          ))}
          {isFileUpdated &&
            (files.length > 0 ? (
              <div className="message bot">
                <div className="message-box">
                  <span className={"message-text"}>Your files have been uploaded!</span>
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
        <div className="download-button-container">
          <button onClick={downloadChat}>
            <FaDownload /> Download Chat History
          </button>
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
