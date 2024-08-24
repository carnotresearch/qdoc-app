import React, { useState, useRef, useContext, useEffect } from "react";
import {
  ListGroup,
  Form,
  Button,
  Card,
  CloseButton,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  RiMessage2Fill,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import axios from "axios";
import { FileContext } from "./FileContext";
import "../styles/sidebar.css";

function Sidebar({ files = [] }) {
  const { setFiles } = useContext(FileContext);
  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const [sessions, setSessions] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState({});
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("here");
    fetchSessions();
    console.log("here again");
  }, []);

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
      sessionsData.reverse();

      const sessions = sessionsData.map((session) => ({
        id: session.session_id,
        timestamp: session.timestamp,
        fileNames: session.file_names,
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
    backgroundColor: "#4e749c",
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
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalFileUpload = async (newFiles) => {
    const updatedFilesArray = [...files, ...Array.from(newFiles)];
    setIsUploading(true);

    try {
      const base64Files = await Promise.all(
        updatedFilesArray.map((file) => {
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

      const sessionId = sessionStorage.getItem("sessionId");
      await axios.post(
        `${process.env.REACT_APP_AWS_ADD_SESSION}`,
        {
          sessionId,
          token,
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setFiles(updatedFilesArray);
      const formData = new FormData();
      updatedFilesArray.forEach((file) => formData.append("files", file));
      formData.append("token", token);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (index) => {
    const removedFile = files[index];
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const formData = new FormData();
    newFiles.forEach((file) => formData.append("files", file));
    formData.append("fileName", removedFile.name);
    const token = sessionStorage.getItem("token");
    formData.append("token", token);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error("Error removing file:", error);
      alert("Couldn't upload file, kindly retry!");
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
    setIsUploading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AWS_FETCH_FILES}`,
        { token, sessionId: session.id },
        { headers: { "Content-Type": "application/json" } }
      );
      const fetchedFiles = response.data.files;
      const fileObjects = transformFetchedFiles(fetchedFiles);
      setFiles(fileObjects);
      uploadToBackend(fileObjects);
      sessionStorage.setItem("sessionId", session.id);
    } catch (error) {
      console.error("Error fetching and appending session files:", error);
    }
    setIsUploading(false);
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
                    <RiMessage2Fill /> <b>New Session</b>
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
              className="d-flex justify-content-between align-items-center session-item"
              style={index === 0 ? { backgroundColor: "#f0f0f0" } : {}}
              onClick={() => fetchAndAppendSessionFiles(session)}
              title={
                index === 0
                  ? "Current Session"
                  : `${formatSessionDate(
                      session.id
                    )} - ${session.fileNames.join(", ")}`
              }
            >
              {index === 0 ? "Current Session" : `Folder - ${index}`}
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  if (index !== 0) {
                    toggleFileVisibility(session.id);
                  }
                }}
              >
                {index === 0 ? (
                  <RiArrowDropUpLine />
                ) : visibleFiles[session.id] ? (
                  <RiArrowDropUpLine />
                ) : (
                  <RiArrowDropDownLine />
                )}
              </Button>
            </ListGroup.Item>

            {index === 0 && (
              <ListGroup>
                {files.map((file, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                    style={listStyle}
                  >
                    <span style={listItemStyle}>{file.name}</span>
                    <div>
                      {isUploading && index === files.length - 1 ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <CloseButton onClick={() => handleRemoveFile(index)} />
                      )}
                    </div>
                  </ListGroup.Item>
                ))}

                {!isUploading && files.length > 0 && (
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
            {index === 0 && <h3 className="mt-3">Your Sessions</h3>}

            {visibleFiles[session.id] && index !== 0 && (
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
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
    </div>
  );
}

export default React.memo(Sidebar);
