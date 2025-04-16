import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { FaDownload, FaComments, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// components
import { FileContext } from "./FileContext";
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
import { fetchFileFromS3 } from "./utils/presignedUtils";

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
  // Add state to track mobile view mode (file or chat)
  const [mobileViewMode, setMobileViewMode] = useState('chat');
  const scannedDocumentWarning = (documentName) =>
    `Unfortunately we couldn't read document: '${documentName}', as it seems to be a scanned document. Kindly upload a readable document.`;

  // Make resetChatHistory available to Sidebar component
  window.resetChatHistory = () => {
    setChatHistory([]);
    console.log("Chat history has been reset");
  };

  // Explicitly show "files uploaded" message after file loading
  const showFilesUploadedMessage = () => {
    setIsFileUpdated(true);
    console.log("Setting isFileUpdated to true - files have been uploaded");
  };
  
  // Make this function available globally
  window.showFilesUploadedMessage = showFilesUploadedMessage;

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

  // Listen for custom event to switch to file view
  useEffect(() => {
    const handleSwitchToFileView = () => {
      setMobileViewMode('file');
    };
    
    window.addEventListener('switchToFileView', handleSwitchToFileView);
    
    return () => {
      window.removeEventListener('switchToFileView', handleSwitchToFileView);
    };
  }, []);

  useEffect(() => {
    setChatHistory([]);
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
        // Reset to default view when switching to desktop
        setMobileViewMode('chat');
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
    
    // Listen for file upload events
    const handleFilesUploaded = () => {
      // We add a small delay to ensure files have been rendered
      setTimeout(() => {
        setIsFileUpdated(true);
        console.log("Files uploaded event received - showing upload message");
      }, 300);
    };
    
    window.addEventListener('filesUploaded', handleFilesUploaded);
    
    return () => {
      // Clean up the event listeners on unmount
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener('filesUploaded', handleFilesUploaded);
    };
  }, [handleOutsideClick]);

  useEffect(() => {
    setIsLoggedIn(true);
    
    // Only show "files uploaded" message when files are initially loaded
    if (files.length > 0 && isFileUpdated) {
      setSidebarCollapsed(true);
    }
    
    // Add null check before focusing
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [files, setIsLoggedIn, isFileUpdated]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Load a document from S3
  const loadSessionDocument = async (sessionId, fileName, pageNo = null) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("User session is expired!");
      setIsLoggedIn(false);
      navigate("/login");
      return;
    }

    // Check if this is from a reference button click or from session change
    const isFromReferenceClick = sessionId === sessionStorage.getItem("sessionId") && 
                               fileName === sessionStorage.getItem("currentFile");
    
    sessionStorage.setItem("sessionId", sessionId);
    setLatestSessionId(sessionId);
    try {
      const file = await fetchFileFromS3(token, sessionId, fileName);
      setFiles([file]);
      sessionStorage.setItem("currentFile", fileName);
      
      // Store page number if provided
      if (pageNo) {
        sessionStorage.setItem("currentPageNo", pageNo);
      }
      
      // Only show "files uploaded" message for new uploads, not reference clicks
      if (isFromReferenceClick) {
        setIsFileUpdated(false);
        console.log("Reference click detected - not showing upload message");
      }
      
      // Only switch to file view on mobile - do NOT interfere with page navigation
      if (isMobileScreen) {
        setMobileViewMode('file');
      }
    } catch (error) {
      console.error("Error fetching file from S3:", error);
    }
  };

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
          newChatHistory[newChatHistory.length - 1].loading = false;
          setChatHistory([...newChatHistory]);
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
          
          // Log full response data with clear formatting
          console.log("%c ===== BACKEND RESPONSE DATA =====", "background: #000; color: #00ff00; font-size: 16px; font-weight: bold;");
          console.log("%c Full Response Object:", "color: #ff6600; font-weight: bold;", response.data);
          console.log("%c Answer:", "color: #ff6600; font-weight: bold;", response.data.answer);
          console.log("%c Sources Array:", "color: #ff6600; font-weight: bold;", response.data.sources);
          
          // Check if response.data is a string (error message) instead of an object with expected properties
          if (typeof response.data === 'string') {
            // If response is a string, use it directly
            newChatHistory[newChatHistory.length - 1].bot = response.data;
          } else if (response.data.answer) {
            // Get the answer from the response object
            newChatHistory[newChatHistory.length - 1].bot = response.data.answer;
            
            // Log cleaned filename (remove temp/ prefix)
            const cleanedFileName = response.data.fileName ? 
              (response.data.fileName.includes('/') ? response.data.fileName.split('/').pop() : response.data.fileName) : '';
            console.log("%c Filename (cleaned):", "color: #ff6600; font-weight: bold;", cleanedFileName);
            console.log("%c Original Filename:", "color: #ff6600; font-weight: bold;", response.data.fileName);
            console.log("%c Page Number:", "color: #ff6600; font-weight: bold;", response.data.pageNo);
            console.log("%c ===============================", "background: #000; color: #00ff00; font-size: 16px; font-weight: bold;");
            
            // Process sources if they exist in the response
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
              console.log("Cleaned sources:", cleanedSources);
            }
            
            // Store standalone fileName and pageNo for fallback
            if (response.data.fileName) {
              let fileName = response.data.fileName;
              if (fileName && fileName.includes('/')) {
                fileName = fileName.split('/').pop();
              }
              newChatHistory[newChatHistory.length - 1].fileName = fileName;
            } else {
              // Use current file if fileName is not in response
              const currentFile = sessionStorage.getItem("currentFile");
              if (currentFile) {
                newChatHistory[newChatHistory.length - 1].fileName = currentFile;
              }
            }
            
            if (response.data.pageNo !== undefined) {
              // Ensure page number starts from 1 (not 0)
              let pageNo = parseInt(String(response.data.pageNo).replace(/\D/g, ''), 10);
              // If pageNo is 0, change to 1
              if (pageNo === 0) pageNo = 1;
              newChatHistory[newChatHistory.length - 1].pageNo = pageNo;
            } else {
              // Default to page 1 if not specified
              newChatHistory[newChatHistory.length - 1].pageNo = 1;
            }
          }
          
          newChatHistory[newChatHistory.length - 1].loading = false;
          setChatHistory([...newChatHistory]);
        }
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
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }

  function resize(e) {
    const container = document.getElementsByClassName("chat-container")[0];
    const containerOffsetLeft = container.offsetLeft;
    const newLeftWidth = e.clientX - containerOffsetLeft;
    const leftDiv = document.getElementsByClassName("file-viewer")[0];
    const rightDiv = document.getElementsByClassName("chat-content")[0];
    const resizer = document.getElementById("resizer");

    if (leftDiv) {
      leftDiv.style.width = newLeftWidth + "px";
    }
    if (rightDiv && resizer) {
      rightDiv.style.width =
        container.clientWidth - newLeftWidth - resizer.offsetWidth + "px";
    }
  }

  function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }

  return (
    <Container
      fluid
      className={`chat-container ${isMobileScreen ? "mobile-screen" : ""}`}
    >
      <div
        ref={sidebarRef} // Attach the ref to the sidebar
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
        style={{ zIndex: 1100 }} // Ensure sidebar appears above tabs and file viewer
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
            loadSessionDocument={loadSessionDocument}
          />
        )}
      </div>
      
      {/* Mobile tabs interface - only show on mobile */}
      {isMobileScreen && (
        <div 
          className="mobile-tabs"
          style={{
            position: 'fixed',
            top: '60px',
            left: '60px', // Leave space for collapsed sidebar
            right: '0',
            display: 'flex',
            zIndex: 1001,
            background: '#f8f9fa',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderRadius: '4px 4px 0 0',
            margin: '0 5px',
            overflow: 'hidden'
          }}
        >
          <div 
            className={`mobile-tab ${mobileViewMode === 'chat' ? 'active' : ''}`}
            onClick={() => setMobileViewMode('chat')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 5px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: mobileViewMode === 'chat' ? '#4a4a4a' : '#777',
              backgroundColor: mobileViewMode === 'chat' ? '#e9ecef' : 'transparent',
              position: 'relative',
              borderRight: '1px solid #eee'
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '6px'
            }}>
              <FaComments style={{ fontSize: '16px' }} />
              <span style={{ marginTop: '0px' }}>Chat</span>
            </span>
          </div>
          <div 
            className={`mobile-tab ${mobileViewMode === 'file' ? 'active' : ''}`}
            onClick={() => setMobileViewMode('file')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 5px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: mobileViewMode === 'file' ? '#4a4a4a' : '#777',
              backgroundColor: mobileViewMode === 'file' ? '#e9ecef' : 'transparent',
              position: 'relative',
              borderLeft: '1px solid #eee'
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '6px'
            }}>
              <FaFileAlt style={{ fontSize: '16px' }} />
              <span style={{ marginTop: '0px' }}>File</span>
            </span>
          </div>
        </div>
      )}
      
      {/* Show FileViewer on desktop or if mobile view mode is 'file' */}
      {(!isMobileScreen || mobileViewMode === 'file') && (
        <FileViewer 
          files={files} 
          style={isMobileScreen && mobileViewMode === 'file' ? {
            display: 'flex', // Override display:none
            background: 'white',
            top: '130px', // Adjust top position to make space for the tabs
            left: '60px' // Position after sidebar
          } : {}}
          className={isMobileScreen && mobileViewMode === 'file' ? 'mobile-view' : ''}
        />
      )}
      
      <div id="resizer" onMouseDown={resizeMusedown}></div>
      
      {/* Show chat content on desktop or if mobile view mode is 'chat' */}
      {(!isMobileScreen || mobileViewMode === 'chat') && (
        <div className="chat-content" style={isMobileScreen ? {
          position: 'absolute',
          top: '130px', // Position below tabs
          left: '60px', // Position after sidebar
          width: 'calc(100% - 60px)', // Width equals viewport minus sidebar
          bottom: 0,
          paddingBottom: '0px',
          margin: 0,
          display: 'flex',
          flexDirection: 'column'
        } : {}}>
          <div className="chat-history" ref={chatHistoryRef} style={isMobileScreen ? {
            flex: '1 1 auto',
            height: 'calc(100vh - 340px)', /* Adjusted height for mobile */
            maxHeight: 'none'
          } : {}}>
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
                loadSessionDocument={loadSessionDocument}
                key={index}
              />
            ))}
            {isFileUpdated &&
              (files.length > 0 ? (
                <div className="message bot">
                  <div className="message-box">
                    <span className={"message-text"}>
                      Your files have been uploaded!
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
          <div className="mobile-chat-controls" style={isMobileScreen ? {
            position: 'relative',
            bottom: '80px',
            left: '0',
            right: '0',
            zIndex: 900,
            backgroundColor: '#fff',
            padding: '10px 0'
          } : {}}>
            <div className="download-button-container" style={isMobileScreen ? {marginTop: '5px', marginBottom: '5px'} : {}}>
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
        </div>
      )}
    </Container>
  );
}

export default ChatPage;
