import React, { useState, useRef, useContext} from "react";
import { ListGroup, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import axios from "axios";
import { FileContext } from "./FileContext";
import "../styles/sidebar.css";
import {
  addUploadFiles,
  fetchFilesFromS3,
  uploadMultiFiles,
} from "./utils/presignedUtils";
import Upload from "./sidebar/Upload";

function Sidebar({
  sessions = [],
  setLatestSessionId,
  latestSessionId,
  selectedSessionFiles,
  setSelectedSessionFiles,
  setSessions,
  setIsLoggedIn,
  setIsScannedDocument,
}) {
  const { setFiles } = useContext(FileContext);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const token = sessionStorage.getItem("token");
  const [visibleFiles, setVisibleFiles] = useState({});
  const navigate = useNavigate();

  // Function to update session CSV/XLSX status
  const updateSessionCsvXlsxStatus = (files) => {
    const hasCsvOrXlsx = files.some((file) => /\.(xlsx|csv)$/i.test(file.name));
    sessionStorage.setItem("currentSessionHasCsvOrXlsx", hasCsvOrXlsx);
  };
  
  const handleRenameSession = async (sessionId) => {
    const newName = prompt("Enter the new name for the session:");
    if (newName && newName.trim() !== "") {
      const nameExists = sessions.some(
        (session) => session.name.toLowerCase() === newName.toLowerCase()
      );
      if (nameExists) {
        alert(
          "A session with this name already exists. Please choose a different name."
        );
        return;
      }

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

  const uploadToBackend = async (files) => {
    try {
      const filesArray = Array.from(files);
      const formData = new FormData();
      filesArray.forEach((file) => formData.append("files", file));
      formData.append("token", token);
      formData.append("sessionId", sessionStorage.getItem("sessionId"));
      setIsUploading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (
        response.data.message &&
        response.data.message === "No data was extracted!"
      ) {
        setIsScannedDocument(true);
        handleDeleteSession(sessionStorage.getItem("sessionId"));
      } else {
        setIsScannedDocument(false);
      }

      setFiles(filesArray);
      setIsUploading(false);

      // Update session CSV/XLSX status
      updateSessionCsvXlsxStatus(filesArray);
    } catch (backendError) {
      if (backendError.response && backendError.response.status === 401) {
        setFiles([]);
        alert("User session is expired!");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        alert("Error uploading files, please check your network connection.");
      }
    }
  };

  const handleFileChange = (event, isAdditionalUpload = false) => {
    const files = Array.from(event.target.files);

    // // Validate file types
    // if (pdfTxtDocxFiles.length > 0 && xlsxCsvFiles.length > 0) {
    //   alert("Please upload either docx, txt, pdf files OR xlsx, csv files only.");
    //   return;
    // }

    if (isAdditionalUpload) {
      handleAdditionalFileUpload(files);
    } else {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files) => {
    const allowedExtensions = /\.(csv|xlsx?|pdf|docx?|txt)$/i; // Regular expression for allowed extensions
    const filesArray = Array.from(files);
  
    // Filter out invalid files
    const invalidFiles = filesArray.filter(file => !allowedExtensions.test(file.name));
    if (invalidFiles.length > 0) {
      alert("Some files have invalid extensions. Only CSV, Excel, PDF, Docx, and Txt files are supported.");
      return; // Exit the function if invalid files are detected
    }
  
    // Calculate the total size for the provided files
    const size = filesArray.reduce((total, file) => total + file.size, 0);
    const estimated_time = Math.floor(size / (1024 * 1024)) * 20; // Estimation formula
    if (estimated_time > 10) {
      setProcessTime(estimated_time);
    }
  
    setIsUploading(true);
    try {
      await uploadMultiFiles(token, files);
      await uploadToBackend(files);
      await fetchSessions();
      const newSessionId = sessionStorage.getItem("sessionId");
      setLatestSessionId(newSessionId);
  
      // Update session CSV/XLSX status after upload
      updateSessionCsvXlsxStatus(files);
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

    setSelectedSessionFiles((prevState) => ({
      ...prevState,
      [sessionId]: [...(prevState[sessionId] || []), ...newFilesArray],
    }));
  
    try {
      addUploadFiles(token, sessionId, newFiles);
  
      const formData = new FormData();
      newFilesArray.forEach((file) => formData.append("files", file));
      formData.append("token", sessionStorage.getItem("token"));
      formData.append("sessionId", sessionId);
  
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/add-upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
  
      // Update session CSV/XLSX status after additional upload
      updateSessionCsvXlsxStatus(newFilesArray);
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

  const fetchAndAppendSessionFiles = async (session) => {
    try {
      setLatestSessionId(session.id);
      axios.post(
        `${process.env.REACT_APP_UPDATE_TIMESTAMP}`,
        { token, sessionId: session.id },
        { headers: { "Content-Type": "application/json" } }
      );
      setVisibleFiles((prevState) => {
        const newState = { ...prevState };
        for (const key in newState) {
          newState[key] = false;
        }
        newState[session.id] = true;
        return newState;
      });
      sessionStorage.setItem("sessionId", session.id);
      const files = await fetchFilesFromS3(token, session.id);
      setFiles(files);

      // Update session CSV/XLSX status
      updateSessionCsvXlsxStatus(files);

      setIsScannedDocument(false);
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

  const addButtonStyle = {
    color: "white",
    width: "100%",
    fontSize: "0.875rem",
  };

  const listItemStyle = {
    flexGrow: 1,
    marginRight: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.875rem",
  };

  return (
    <div>
      <Upload
        handleFileUpload={handleFileUpload}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
        processTime={processTime}
      />
      <ListGroup>
        {sessions.slice(0, 4).map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className={`d-flex justify-content-between session-item ${
                session.id === latestSessionId ? "latest-container" : ""
              }`}
              onClick={() => fetchAndAppendSessionFiles(session)}
              title={`${formatSessionDate(
                session.id
              )} - ${session.fileNames.join(", ")}`}
            >
              {session.name}
              <ButtonGroup>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameSession(session.id);
                  }}
                >
                  <RiEdit2Line />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                >
                  <RiDeleteBinLine />
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFileVisibility(session.id);
                  }}
                >
                  {visibleFiles[session.id] ? (
                    <RiArrowDropUpLine />
                  ) : (
                    <RiArrowDropDownLine />
                  )}
                </Button>
              </ButtonGroup>
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
                    className="mb-2 bg-secondary"
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
                  accept=".txt,.pdf,.docx, .xlsx, .csv"
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
