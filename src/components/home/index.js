import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// components
import { FileContext } from "../FileContext";
import { ttsSupportedLanguages } from "../../constant/data";
import FileViewer from "../chatpage/FileViewer";
import { Button, Container } from "react-bootstrap";
import "../../styles/chatPage.css";
import Features from "./Features";
import ChatContent from "./ChatContent";
import MiddleBlock from "./MiddleBlock";
import WelcomePopup from "./WelcomePopup";
import { MenuOutlined } from "@mui/icons-material";
import LeftMenu from "./LeftMenu";

function Home({
  inputLanguage,
  outputLanguage,
  isFileUpdated,
  setIsFileUpdated,
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const messageInputRef = useRef(null);
  const { files } = useContext(FileContext);
  const [welcomPopop, setWelcomePopup] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fpPromise = FingerprintJS.load();
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const fingerprint = result.visitorId;
        sessionStorage.setItem("fingerprint", fingerprint);
      });
    if (!sessionStorage.getItem("trialUsed")) {
      setWelcomePopup(true);
    }
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      setIsFileUpdated(true);
      const sessionDetails = {
        id: "1",
        name: "knowledge container",
        fileNames: [files[0].name],
      };
      setSessions([sessionDetails]);
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  }, [files, setIsFileUpdated]);

  const handleSendMessage = async (message) => {
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

      try {
        // Constructing the correct payload
        const payload = {
          message,
          fingerprint: sessionStorage.getItem("fingerprint"),
          inputLanguage,
          outputLanguage,
          context: "files",
          mode: "contextual",
        };

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/trialAsk`,
          payload
        );
        newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
        newChatHistory[newChatHistory.length - 1].loading = false;
        setChatHistory([...newChatHistory]);
      } catch (error) {
        console.error("There was an error!", error);
        setChatHistory((prevChatHistory) => {
          const updatedChatHistory = [...prevChatHistory];

          // Update the loading field of the last object
          if (updatedChatHistory.length > 0) {
            updatedChatHistory[updatedChatHistory.length - 1] = {
              ...updatedChatHistory[updatedChatHistory.length - 1],
              loading: false,
            };
          }

          return updatedChatHistory;
        });
      }
    }
  };

  return isFileUpdated ? (
    <Container fluid className="chat-container">
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Button
          variant="secondary"
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <MenuOutlined className="menu-icon" fontSize="medium" />
        </Button>
        {!sidebarCollapsed && <LeftMenu sessions={sessions} />}
      </div>
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
    </Container>
  ) : (
    <Container
      fluid
      className="chat-container"
      style={{ padding: 0, margin: 0 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: 0,
          padding: 0,
          width: "100%",
          overflowY: "auto",
          alignItems: "center",
        }}
        className="responsive-layout"
      >
        <style>
          {`
              @media (max-width: 768px) {
                .left-container {
                  width: 100% !important
                }
                .responsive-layout {
                  flex-direction: column;
                  height: auto;
                }
                .hide-on-mobile {
                  display: none !important;
                }
              }
            `}
        </style>

        {/* Left Section: Features */}
        <div
          className="hide-on-mobile"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
          }}
        >
          <Features />
        </div>
        {/* Right Section: MiddleBlock */}
        <div
          className="left-container"
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            height: "100%",
            width: "50%",
          }}
        >
          <MiddleBlock />
        </div>
      </div>
      <WelcomePopup showPopup={welcomPopop} setShowPopup={setWelcomePopup} />
    </Container>
  );
}

export default Home;
