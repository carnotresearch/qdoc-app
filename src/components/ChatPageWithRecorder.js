import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faRobot } from "@fortawesome/free-solid-svg-icons";
import { ReactMic } from "react-mic";
import { FaMicrophone, FaTrashAlt } from "react-icons/fa";
import "../styles/chatPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChatPageWithRecorder({ submittedData, setSubmittedData }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!submittedData.files.length && !submittedData.urls.length) {
      navigate("/");
    }
  }, [submittedData, navigate]);

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
        const response = await axios.post(`http://54.174.84.57:5000/ask`, {
          message,
          sessionName: submittedData.sessionName,
          inputLanguage: submittedData.inputLanguage,
          outputLanguage: submittedData.outputLanguage,
        });

        console.log("response for /ask is : ");
        console.log(response.data);

        setChatHistory([
          ...chatHistory,
          { user: message, bot: response.data.answer, timestamp },
        ]);
      } catch (error) {
        console.error("There was an error!", error);
        setChatHistory([
          ...chatHistory,
          { user: message, bot: "Error! kindly try again", timestamp },
        ]);
      }
    } else {
      if (audioBlob) {
        // processing of audio
        console.log("Audio Blob:", audioBlob);
      }
      setAudioBlob(null);
      setAudioUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (recordedBlob) => {
    setIsRecording(false);
    setAudioBlob(recordedBlob.blob);
    setAudioUrl(URL.createObjectURL(recordedBlob.blob));
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl("");
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
        <h2>QDoc by Carnot Research</h2>
        <div className="chat-history">
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
                  <FontAwesomeIcon icon={faRobot} className="icon" />
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
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <div className="d-flex align-items-center">
            <Button variant="secondary" onClick={handleStartRecording}>
              <FaMicrophone /> Record
            </Button>
            {audioUrl && (
              <div className="d-flex align-items-center ml-2">
                <audio controls src={audioUrl} className="mr-2" />
                <Button variant="danger" onClick={handleDeleteRecording}>
                  <FaTrashAlt /> Delete
                </Button>
              </div>
            )}
          </div>
          <Button type="submit" className="mt-2">
            Send
          </Button>
          <ReactMic
            record={isRecording}
            className="d-none"
            onStop={handleStopRecording}
            mimeType="audio/wav"
          />
        </Form>
      </div>
    </Container>
  );
}

export default ChatPageWithRecorder;
