import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// components
import { FileContext } from "../FileContext";
import { ttsSupportedLanguages } from "../../constant/data";
import FileViewer from "../chatpage/FileViewer";
// icons and style
import { Container } from "react-bootstrap";
import "../../styles/chatPage.css";
import Popup from "./Popup";
import Features from "./Features";
import ChatContent from "./ChatContent";
import MiddleBlock from "./MiddleBlock";

function Home() {
  const inputLanguage = "23";
  const outputLanguage = "23";
  const [chatHistory, setChatHistory] = useState([]);
  const messageInputRef = useRef(null);
  const { files } = useContext(FileContext);
  const [isFileUpdated, setIsFileUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [showFeatures, setShowFeatures] = useState(true);
  const navigate = useNavigate();
  const popupText = "Kindly login to ask further questions.";

  useEffect(() => {
    const fpPromise = FingerprintJS.load();
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const fingerprint = result.visitorId;
        localStorage.setItem("fingerprint", fingerprint);
      });
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      setShowFeatures(false);
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
        if (response?.data?.message === "Free Trial limit is exhausted") {
          setShowPopup(true);
        }
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
    <Container fluid className="chat-container" style={{ padding: 0, margin: 0 }}>
  {showFeatures && !isFileUpdated ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row", // Default for larger screens
        height: "100vh",
        margin: 0,
        padding: 0,
        width: "100%",
        overflowY: "auto",
      }}
      className="responsive-layout"
    >
      <style>
        {`
          @media (max-width: 768px) {
            .responsive-layout {
              flex-direction: column; /* Stack vertically on mobile */
              height: auto; /* Allow scrolling if needed */
            }
          }
        `}
      </style>

      {/* Left Section: MiddleBlock */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center", // Center vertically
          justifyContent: "center", // Center horizontally
          backgroundColor: "#f9f9f9",
          padding: "1rem",
          height: "100%", // Ensure it takes the full height
        }}
      >
        <MiddleBlock />
      </div>

      {/* Right Section: Features */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center", // Center vertically
          justifyContent: "center", // Center horizontally
          backgroundColor: "#ffffff",
          padding: "1rem",
          height: "100%", // Ensure it takes the full height
        }}
      >
        <Features />
      </div>
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
  <Popup showPopup={showPopup} setShowPopup={setShowPopup} popupText={popupText} />
</Container>

  );
}

export default Home;
