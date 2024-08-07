import React, { useState, useRef, useContext, useEffect } from "react";
import {
  ListGroup,
  Form,
  Button,
  Card,
  CloseButton,
  Spinner,
} from "react-bootstrap";
import { RiMessage2Fill, RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import axios from "axios";
import { FileContext } from "./FileContext";

function Sidebar({ files = [], username }) { // Added username as a prop
  const { setFiles } = useContext(FileContext);
  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const [sessions, setSessions] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState({});
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const token = sessionStorage.getItem("token");
  username = "testuser"; // Hardcoded username for testing

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.post(
        `https://2n5j71807b.execute-api.ap-south-1.amazonaws.com/default/fetchSessions`,
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data.data;
      const sessionsData = data.sessions;

      const sessions = sessionsData.map((session) => session.session_id);
      const files = sessionsData.reduce((acc, session) => {
        acc[session.session_id] = session.file_names.map((fileName) => ({
          name: fileName,
          size: 0, // Assuming size is unknown, set to 0 or fetch actual size if available
        }));
        return acc;
      }, {});

      setSessions(sessions);
      setSelectedSessionFiles(files);
    } catch (error) {
      console.error("Error fetching sessions from AWS Lambda:", error);
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
    width: "auto",
    padding: "0.375rem 0.75rem",
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

    const filesArray = Array.from(files);

    setIsUploading(true);

    try {
      const base64Files = await Promise.all(
        filesArray.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
              filename: file.name,
              content: reader.result.split(',')[1], // Extract base64 content
            });
            reader.onerror = (error) => reject(error);
          });
        })
      );

      const response = await axios.post(
        `https://70tkoc9eb2.execute-api.ap-south-1.amazonaws.com/default/addtoS3`,
        {
          username,
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      setFiles([...filesArray]); // Update the files context with uploaded files
    } catch (error) {
      console.error("Error uploading files to AWS Lambda:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalFileUpload = async (files) => {
    const filesArray = Array.from(files);

    setIsUploading(true);

    try {
      const base64Files = await Promise.all(
        filesArray.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
              filename: file.name,
              content: reader.result.split(',')[1], // Extract base64 content
            });
            reader.onerror = (error) => reject(error);
          });
        })
      );

      const response = await axios.post(
        `https://70tkoc9eb2.execute-api.ap-south-1.amazonaws.com/default/addtoS3`,
        {
          username,
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      setFiles((prevFiles) => [...prevFiles, ...filesArray]); // Append additional files
    } catch (error) {
      console.error("Error uploading additional files to AWS Lambda:", error);
      alert("Error uploading additional files, please try again.");
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
    newFiles.forEach((file) => formData.append("files", file)); // Send remaining files
    formData.append("fileName", removedFile.name);
    const token = sessionStorage.getItem("token");
    formData.append("token", token);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error removing file:", error);
      alert("Couldn't upload file, kindly retry!");
    }
  };

  const toggleFileVisibility = (session) => {
    setVisibleFiles((prevState) => ({
      ...prevState,
      [session]: !prevState[session],
    }));
  };

  const updateSessionFiles = async (session) => {
    const sessionFiles = selectedSessionFiles[session];
    if (!sessionFiles) {
      alert("No files available for this session.");
      return;
    }

    const formData = new FormData();
    sessionFiles.forEach((file) => formData.append("files", file));
    const token = sessionStorage.getItem("token");
    formData.append("token", token);

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      setFiles(sessionFiles);
      alert(`Files from ${session} have been uploaded.`);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
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
              accept=".txt,.pdf,.docx,.doc"
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
                    <RiMessage2Fill /> <b>New Chat</b>
                  </p>
                  <p className="mb-0">Drop files here</p>
                </div>
              )}
            </Card>
          </div>
        </Form.Group>
      </Form>
      <ListGroup>
        {files.map((file, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
            style={listStyle}
          >
            <span style={listItemStyle}>
              {file.name} - {(file.size / 1024).toFixed(2)} KB
            </span>
            <div>
              {isUploading && index === files.length - 1 ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <CloseButton onClick={() => handleRemoveFile(index)} />
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {!isUploading && files.length > 0 && (
        <Button
          className="mt-2"
          variant="secondary"
          onClick={() => additionalFileInputRef.current.click()}
          style={addButtonStyle}
        >
          + Add More
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
      <h3>Sessions</h3>
      <ListGroup>
        {sessions.map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center"
              style={listStyle}
              onClick={() => updateSessionFiles(session)}
            >
              <span style={listItemStyle}>{session}</span>
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFileVisibility(session);
                }}
              >
                {visibleFiles[session] ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
              </Button>
            </ListGroup.Item>
            {visibleFiles[session] && (
              <ListGroup>
                {selectedSessionFiles[session]?.map((file, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                    style={listStyle}
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

export default Sidebar;
