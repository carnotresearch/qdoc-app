import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// components
import { FileContext } from "../FileContext";
import { ttsSupportedLanguages } from "../../constant/data";
import FileViewer from "../chatpage/FileViewer";
// icons and style
import { Button, Container } from "react-bootstrap";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "../../styles/chatPage.css";
import MessageInput from "../chatpage/MessageInput";
import ChatHistory from "../chatpage/ChatHistory";
import LeftMenu from "./LeftMenu";
import Popup from "./Popup";
import Features from "./Features";

function Home() {
  const inputLanguage = "23";
  const outputLanguage = "23";
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const chatHistoryRef = useRef(null);
  const messageInputRef = useRef(null);
  const { files } = useContext(FileContext);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionFiles, setSelectedSessionFiles] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(true);
  const navigate = useNavigate();
  const popupText = "Kindly login to ask further questions.";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYW5hdkBjYXJub3RyZXNlYXJjaC5jb20iLCJpYXQiOjE3MzM3NTY5MjIsImV4cCI6MTczMzc2MDUyMn0.8ngRubqw8MbKHeJkRdxxeZRpEzT_WXGXotZXoN5iBmU";

  const fetchSessions = useCallback(async () => {
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

      // console.log(sessions);
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
    }
  }, []);
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
  // useEffect(() => {
  //   setIsFileUpdated(true);
  //   messageInputRef.current.focus();
  //   if (files.length > 0) {
  //     setSidebarCollapsed(true);
  //   }
  // }, [files]);

  // auto scroll down to latest chat response
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (message) => {
    setIsFileUpdated(false);
    if (message.trim()) {
      if (chatCount >= 1) {
        setShowPopup(true);
        return;
      }
      setChatCount(chatCount + 1);
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
      const context = files.length > 0 ? "files" : "";
      try {
        let temperature = 0.1;
        const context_mode = sessionStorage.getItem("answerMode");
        if (context_mode && context_mode === "creative") {
          temperature = 0.8;
        }

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
        newChatHistory[newChatHistory.length - 1].loading = false;
        setChatHistory([...newChatHistory]);
      } catch (error) {
        console.error("There was an error!", error);
        setShowPopup(true);
        navigate("/login");
      }
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
          <LeftMenu
            sessions={sessions}
            selectedSessionFiles={selectedSessionFiles}
            setIsFileUploaded={setIsFileUploaded}
          />
        )}
      </div>
      {files && <FileViewer files={files} />}
      {/* {isFileUploaded ? (
        <Features />
      ) : ( */}
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
              chat={chat}
              index={index}
              outputLanguage={outputLanguage}
              key={index}
            />
          ))}
          {isFileUpdated && (
            <div className="message bot">
              <div className="message-box">
                <span className={"message-text"}>
                  <b className="text-success">icarKno: </b>
                  Your files have been uploaded!
                </span>
              </div>
            </div>
          )}
        </div>
        <MessageInput
          inputLanguage={inputLanguage}
          messageInputRef={messageInputRef}
          handleSendMessage={handleSendMessage}
        />
      </div>
      {/* )} */}
      {/** Popup for login */}
      <Popup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        popupText={popupText}
      />
    </Container>
  );
}
export default Home;
