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

  const handleInputFocus = () => {
    if (window.innerWidth <= 768) {
      // hide sidebar while typing
      setSidebarCollapsed(true);
    }
  };

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

     // Update only this part in the handleSendMessage function in src/components/home/index.js

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
  
  // Set the answer text
  newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
  
  // Process sources if they exist in the response (copy logic from ChatPage.js)
  if (response.data.sources && Array.isArray(response.data.sources)) {
    // Clean both filenames and page numbers
    const cleanedSources = response.data.sources.map(source => {
      // Handle filename prefix (remove "temp/" or similar)
      let fileName = source.fileName;
      if (fileName && fileName.includes('/')) {
        // Take everything after the last slash
        fileName = fileName.split('/').pop();
      }
      
      // Clean page number to be a valid number
      const pageNo = parseInt(String(source.pageNo).replace(/\D/g, ''), 10) || 1;
      
      return { fileName, pageNo };
    });
    
    newChatHistory[newChatHistory.length - 1].sources = cleanedSources;
  }
  
  // Store standalone fileName and pageNo for fallback (same as in ChatPage.js)
  if (response.data.fileName) {
    let fileName = response.data.fileName;
    if (fileName && fileName.includes('/')) {
      fileName = fileName.split('/').pop();
    }
    newChatHistory[newChatHistory.length - 1].fileName = fileName;
  } else {
    // Use current file if fileName is not in response
    const currentFile = files.length > 0 ? files[0].name : null;
    if (currentFile) {
      newChatHistory[newChatHistory.length - 1].fileName = currentFile;
    }
  }
  
  if (response.data.pageNo !== undefined) {
    // Ensure page number starts from 1 (not 0)
    let pageNo = parseInt(String(response.data.pageNo).replace(/\D/g, ''), 10);
    if (pageNo === 0) pageNo = 1;
    newChatHistory[newChatHistory.length - 1].pageNo = pageNo;
  } else {
    // Default to page 1 if not specified
    newChatHistory[newChatHistory.length - 1].pageNo = 1;
  }
  
  newChatHistory[newChatHistory.length - 1].loading = false;
  setChatHistory([...newChatHistory]);
} catch (error) {
  console.error("There was an error!", error);
  newChatHistory[newChatHistory.length - 1].bot = "Couldn't fetch response. Please try again.";
  newChatHistory[newChatHistory.length - 1].loading = false;
  setChatHistory([...newChatHistory]);
}
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".sidebar") && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [sidebarCollapsed]);

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
        {!sidebarCollapsed && (
          <LeftMenu
            sessions={sessions}
            setSessions={setSessions}
            setIsFileUpdated={setIsFileUpdated}
          />
        )}
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
        handleInputFocus={handleInputFocus}
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
 