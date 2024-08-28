import React, { useState, useRef, useContext, useEffect } from "react";
import {
  ListGroup,
  Form,
  Button,
  Card,
  Spinner,
  ButtonGroup
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  RiMessage2Fill,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import axios from "axios";
import { FileContext } from "./FileContext";
import "../styles/sidebar.css";

function Sidebar({ files = [] , sessions = [], setLatestSessionId, latestSessionId, selectedSessionFiles, setSelectedSessionFiles, setSessions, }) {
  const { setFiles } = useContext(FileContext);
  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const token = sessionStorage.getItem("token");
  const [visibleFiles, setVisibleFiles] = useState({});
  const navigate = useNavigate();

  const handleRenameSession = async (sessionId) => {
    const newName = prompt("Enter the new name for the session:");
    if (newName && newName.trim() !== "") {
      try {
        await axios.post(
          `${process.env.REACT_APP_RENAME}`, 
          {
            sessionId,
            newName,
            token: sessionStorage.getItem("token"),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === sessionId ? { ...session, name: newName } : session
          )
        );
      } catch (error) {
        console.error("Error renaming session:", error);
        alert("Failed to rename the session. Please try again.");
      }
    }
  };
  

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await axios.post(
          `${process.env.REACT_APP_DELETE_SESSION}`, 
          {
            sessionId,
            token: sessionStorage.getItem("token"),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setSessions((prevSessions) =>
          prevSessions.filter((session) => session.id !== sessionId)
        );
      } catch (error) {
        console.error("Error deleting session:", error);
        alert("Failed to delete the session. Please try again.");
      }
    }
  };

  const uploadToS3 = async (files) => {
    try {
      const filesArray = Array.from(files);
      const base64Files = await Promise.all(
        filesArray.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
              resolve({
                filename: file.name,
                content: reader.result.split(",")[1],
              });
            reader.onerror = (error) => reject(error);
          });
        })
      );
      const lambdaResponse = await axios.post(
        `${process.env.REACT_APP_AWS_UPLOAD_URL}`,
        {
          token,
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      sessionStorage.setItem("sessionId", lambdaResponse.data.sessionId);
    } catch (lambdaError) {
      console.error("Error uploading files to AWS:", lambdaError);
    }
  };

  const uploadToBackend = async (files) => {
    try {
      const filesArray = Array.from(files);
      const formData = new FormData();
      filesArray.forEach((file) => formData.append("files", file));
      formData.append("token", token);
      formData.append("sessionId", sessionStorage.getItem("sessionId"));
      setIsUploading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFiles(filesArray);
      setIsUploading(false);
    } catch (backendError) {
      if (backendError.response) {
        if (backendError.response.status === 401) {
          setFiles([]);
          alert("User session is expired!");
          navigate("/login");
        } else {
          console.log(
            "Error uploading files to backend, please check your network connection."
          );
        }
      } else {
        alert("Error uploading files, please check your network connection.");
      }
    }
  };

  const handleFileChange = (event, isAdditionalUpload = false) => {
    if (isAdditionalUpload) {
      handleAdditionalFileUpload(event.target.files);
    } else {
      handleFileUpload(event.target.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    handleFileUpload(files);
  };

  const listStyle = {
    padding: "0.5rem",
    wordWrap: "break-word",
    overflow: "hidden",
    color: "white",
    backgroundColor: "#7393b6",
    display: "flex",
    alignItems: "center",
  };

  const addButtonStyle = {
    color: "white",
    width: "50%",
    padding: "0.375rem 0.75rem",
    margin: "auto",
    fontSize: "0.875rem",
  };

  const listItemStyle = {
    flexGrow: 1,
    marginRight: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const handleFileUpload = async (files) => {
    let size = 0;
    for (let i = 0; i < files.length; i++) {
      size += files[i].size;
    }
    // Converting bytes to MB and multiply by 20 for avg
    const estimated_time = Math.floor(size / (1024 * 1024)) * 20;
    if (estimated_time > 10) {
      setProcessTime(estimated_time);
    }
    setIsUploading(true);
    try {
      await uploadToS3(files);
      await uploadToBackend(files);
      await fetchSessions();
      // Highlight the latest session (New Container)
      const newSessionId = sessionStorage.getItem("sessionId");
      setLatestSessionId(newSessionId);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const fetchSessions = async () => {
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
  };

  const handleAdditionalFileUpload = async (newFiles) => {
    const newFilesArray = Array.from(newFiles);
    setIsUploading(true);
    const sessionId = latestSessionId || sessionStorage.getItem("sessionId");
  
    // Set the updated files array for the session
    setSelectedSessionFiles((prevState) => ({
      ...prevState,
      [sessionId]: [...(prevState[sessionId] || []), ...newFilesArray],
    }));
  
    try {
      const base64Files = await Promise.all(
        newFilesArray.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
              resolve({
                filename: file.name,
                content: reader.result.split(",")[1],
              });
            reader.onerror = (error) => reject(error);
          });
        })
      );
  
      // Sending the base64 encoded files to AWS Add Session
      await axios.post(
        `${process.env.REACT_APP_AWS_ADD_SESSION}`,
        {
          sessionId,
          token: sessionStorage.getItem("token"),
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Now sending only the newly added files to the backend
      const formData = new FormData();
      newFilesArray.forEach((file) => formData.append("files", file));
      formData.append("token", sessionStorage.getItem("token"));
      formData.append("sessionId", sessionId);
  
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/add-upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      // Update the local files state with the new files added
      setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleFileVisibility = (session) => {
    setVisibleFiles((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (key !== session) {
          newState[key] = false;
        }
      }
      newState[session] = !newState[session];
      return newState;
    });
  };

  const base64ToBlob = (base64, type = "") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  const transformFetchedFiles = (fetchedFiles) => {
    return fetchedFiles.map((file) => {
      const extension = file.key.split(".").pop().toLowerCase();
      let type = "application/octet-stream";

      switch (extension) {
        case "txt":
          type = "text/plain";
          break;
        case "docx":
          type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "pdf":
          type = "application/pdf";
          break;
        default:
          type = "none";
      }

      const blob = base64ToBlob(file.content, type);
      return new File([blob], file.key.split("/").pop(), {
        type: type,
        lastModified: new Date(file.lastModified).getTime(),
      });
    });
  };

  const fetchAndAppendSessionFiles = async (session) => {
    try {
      setLatestSessionId(session.id); 
      const updateResponse =  axios.post(
        `${process.env.REACT_APP_UPDATE_TIMESTAMP}`,
        { token, sessionId: session.id},
        { headers: { "Content-Type": "application/json" } }
      );
      // Auto-expand the selected session
      setVisibleFiles((prevState) => {
        const newState = { ...prevState };
        for (const key in newState) {
          newState[key] = false; // Collapse all other sessions
        }
        newState[session.id] = true; // Expand the selected session
        return newState;
      });
  
      const response = await axios.post(
        `${process.env.REACT_APP_AWS_FETCH_FILES}`,
        { token, sessionId: session.id },
        { headers: { "Content-Type": "application/json" } }
      );
      const fetchedFiles = response.data.files;
      const fileObjects = transformFetchedFiles(fetchedFiles);
      setFiles(fileObjects);
      sessionStorage.setItem("sessionId", session.id);
    } catch (error) {
      console.error("Error fetching and appending session files:", error);
    }
  };

  const formatSessionDate = (sessionId) => {
    const date = new Date(
      sessionId.slice(0, 4),
      sessionId.slice(4, 6) - 1,
      sessionId.slice(6, 8)
    );
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const marginStyle = { marginTop: "1.5cm" };

  return (
    <div>
      <Form style={marginStyle}>
        <Form.Group className="mb-3">
          <div
            className="custom-file-input"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              id="file"
              accept=".txt,.pdf,.docx"
              multiple
              onChange={(event) => handleFileChange(event, false)}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Card
              className="p-1"
              style={{
                border: "2px dashed #ccc",
                textAlign: "center",
                height: "50",
              }}
            >
              {isUploading ? (
                <div className="text-center">
                  <Spinner animation="border" size="sm" />
                  <p className="mb-0">
                    This may take up to {processTime} seconds...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-0">
                    <RiMessage2Fill /> <b>New Container</b>
                  </p>
                  <p className="mb-0">Drop files here</p>
                </div>
              )}
            </Card>
          </div>
        </Form.Group>
      </Form>

      <ListGroup>
        {sessions.slice(0, 4).map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className={`d-flex justify-content-between align-items-center session-item ${
                session.id === latestSessionId ? "latest-container" : ""
              }`}
              onClick={() => fetchAndAppendSessionFiles(session)}
              title={`${formatSessionDate(
                session.id
              )} - ${session.fileNames.join(", ")}`}
            >
              {session.name}
              <div className="d-flex align-items-center">
                <ButtonGroup>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering folder selection
                      handleRenameSession(session.id);
                    }}
                  >
                    <RiEdit2Line />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering folder selection
                      handleDeleteSession(session.id);
                    }}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </ButtonGroup>
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFileVisibility(session.id);
                  }}
                  style={{ paddingTop: "0", paddingBottom: "0" }}
                >
                  {visibleFiles[session.id] ? (
                    <RiArrowDropUpLine />
                  ) : (
                    <RiArrowDropDownLine />
                  )}
                </Button>
              </div>
            </ListGroup.Item>

            {visibleFiles[session.id] && (
              <ListGroup>
                {selectedSessionFiles[session.id]?.map((file, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center file-item"
                  >
                    <span style={listItemStyle}>
                      {file.name} - {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </ListGroup.Item>
                ))}

                {!isUploading && session.id === latestSessionId && (
                  <Button
                    className="mt-2 bg-secondary"
                    variant="secondary"
                    onClick={() => additionalFileInputRef.current.click()}
                    style={addButtonStyle}
                  >
                    <big>+</big> Add Files
                  </Button>
                )}
                <input
                  type="file"
                  id="additional-file"
                  accept=".txt,.pdf,.docx"
                  multiple
                  onChange={(event) => handleFileChange(event, true)}
                  ref={additionalFileInputRef}
                  style={{ display: "none" }}
                />
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
    </div>
  );
}

export default React.memo(Sidebar);