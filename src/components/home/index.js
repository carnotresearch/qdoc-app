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
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "../../styles/chatPage.css";
import LeftMenu from "./LeftMenu";
import Popup from "./Popup";
import Features from "./Features";
import ChatContent from "./ChatContent";
import MiddleBlock from "./MiddleBlock";

function Home() {
  const inputLanguage = "23";
  const outputLanguage = "23";
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messageInputRef = useRef(null);
  const { files } = useContext(FileContext);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionFiles, setSelectedSessionFiles] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [showFeatures, setShowFeatures] = useState(true);
  const navigate = useNavigate();
  const popupText = "Kindly login to ask further questions.";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYW5hdmthbmlyZUBnbWFpbC5jb20iLCJpYXQiOjE3MzM4MTU2NDgsImV4cCI6MTczMzgxOTI0OH0.vwUvLsOziesVg6uQ4XPpUq1QVrZKD4E2juCBH95yZYA";

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
  useEffect(() => {
    console.log("here");
    if (files.length > 0) {
      setShowFeatures(false);
      console.log("here2");
      setSidebarCollapsed(true);
      setIsFileUpdated(true);
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  }, [files]);

  const handleSendMessage = async (message) => {
    setIsFileUpdated(false);
    if (message.trim()) {
      if (chatCount >= 10) {
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
          />
        )}
      </div>
      {showFeatures && !isFileUpdated ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <MiddleBlock setSidebarCollapsed={setSidebarCollapsed} />
          <Features />
        </div>
      ) : (
        <>
          {files && <FileViewer files={files} />}
          <ChatContent
            chatHistory={chatHistory}
            files={files}
            handleSendMessage={handleSendMessage}
            inputLanguage={inputLanguage}
            outputLanguage={outputLanguage}
            messageInputRef={messageInputRef}
            isFileUpdated={isFileUpdated}
          />
        </>
      )}
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
