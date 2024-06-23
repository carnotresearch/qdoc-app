import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import "../styles/chatPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChatPage({ submittedData, setSubmittedData }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (!submittedData.files.length && !submittedData.urls.length) {
      navigate("/");
    }
  }, [submittedData, navigate]);

  useEffect(() => {
    // Scroll to the bottom whenever chatHistory changes
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChatHistory([
        ...chatHistory,
        { user: message, bot: "Loading...", timestamp },
      ]);
      setMessage("");
      console.log(submittedData);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/ask`,
          {
            message,
            sessionName: submittedData.sessionName,
            inputLanguage: submittedData.inputLanguage,
            outputLanguage: submittedData.outputLanguage,
          }
        );

        console.log("response for /ask is : ");
        console.log(response.data);

        setChatHistory((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1), // remove the "Loading..." message
          { user: message, bot: response.data.answer, timestamp },
        ]);
      } catch (error) {
        console.error("There was an error!", error);
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1), // remove the "Loading..." message
          { user: message, bot: "Error! Kindly try again", timestamp },
        ]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
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
      <div className="chat-content">
        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.map((chat, index) => (
            <div key={index} className="message-wrapper">
              <div className="message user">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                <div className="message-box">
                  <span className="message-text">{chat.user}</span>
                  <span className="message-time">{chat.timestamp}</span>
                </div>
              </div>
              <div className="message bot">
                <div className="icon-wrapper">
                  <img src="/logo.png" alt="Bot" className="icon-wrapper" />
                </div>
                <div className="message-box">
                  <span className="message-text">{chat.bot}</span>
                  <span className="message-time">{chat.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Form className="d-flex" onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />
            <Button type="submit" variant="primary">
              Send
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Container>
  );
}

export default ChatPage;
