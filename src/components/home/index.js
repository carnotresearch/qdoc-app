import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
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
  const [chatCount, setChatCount] = useState(0);
  const [showFeatures, setShowFeatures] = useState(true);
  const navigate = useNavigate();
  const popupText = "Kindly login to ask further questions.";

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

  useEffect(() => {
    // Generate a fingerprint
    const fpPromise = FingerprintJS.load();

    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const fingerprint = result.visitorId; // Unique ID for the browser/device
        localStorage.setItem("fingerprint", fingerprint);
      });
  }, []);

  // cursor on input query field when files are updated
  useEffect(() => {
    if (files.length > 0) {
      setShowFeatures(false);
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
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/trialAsk`,
          {
            message,
            fingerprint: localStorage.getItem("fingerprint"),
            inputLanguage,
            outputLanguage,
            context: "files",
            mode: "contextual",
          }
        );
        console.log(response);
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
        {!sidebarCollapsed && <LeftMenu />}
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
