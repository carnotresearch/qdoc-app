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
import '../styles/Sidebar.css';

function Sidebar({ files = [], username }) {
  const { setFiles } = useContext(FileContext);
  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const [sessions, setSessions] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState({});
  const [selectedSessionFiles, setSelectedSessionFiles] = useState({});
  const token = sessionStorage.getItem("token");

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
      if (!data || !data.sessions || data.sessions.length === 0) {
        console.log("No sessions available.");
        return;
      }

      const sessionsData = data.sessions;

      // Sort sessions by timestamp descending
      sessionsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const sessions = sessionsData.map((session) => ({
        id: session.session_id,
        fileNames: session.file_names,
      }));

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
        `https://ha9y51vhw2.execute-api.ap-south-1.amazonaws.com/default/uploadFile`,
        {
          token,
          files: base64Files,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      setFiles((prevFiles) => [...prevFiles, ...filesArray]); // Update the files context with uploaded files
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
        `https://ha9y51vhw2.execute-api.ap-south-1.amazonaws.com/default/uploadFile`,
        {
          token,
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
    setVisibleFiles((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (key !== session) {
          newState[key] = false; // Collapse all other sessions
        }
      }
      newState[session] = !newState[session]; // Toggle the clicked session
      return newState;
    });
  };

  const base64ToBlob = (base64, type = '') => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };
  
  const transformFetchedFiles = (fetchedFiles) => {
    return fetchedFiles.map(file => {
      const blob = base64ToBlob(file.content, 'application/pdf'); // Assuming the file type is PDF, adjust the type accordingly
      return new File([blob], file.key.split('/').pop(), {
        type: 'application/pdf', // Adjust the type accordingly
        lastModified: new Date(file.lastModified).getTime()
      });
    });
  };
  
  

  const fetchAndAppendSessionFiles = async (session) => {
    try {
      const response = await axios.post(
        `https://0b67ejrhq7.execute-api.ap-south-1.amazonaws.com/default/fetchFiles`,
        { token, sessionId: session.id },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
  
      const fetchedFiles = response.data.files;
      console.log("fetched files: " ,fetchedFiles);

      const fileObjects = transformFetchedFiles(fetchedFiles);
      console.log(fileObjects);
      // const newFiles = fetchedFiles.map((file) => ({
      //   name: file.key.split("/").pop(),
      //   size: file.size,
      //   content: file.content,
      // }));
  
      // const fileObjects = newFiles.map((file) => {
      //   const byteCharacters = atob(file.content);
      //   const byteNumbers = new Array(byteCharacters.length);
      //   for (let i = 0; i < byteCharacters.length; i++) {
      //     byteNumbers[i] = byteCharacters.charCodeAt(i);
      //   }
      //   const byteArray = new Uint8Array(byteNumbers);
      //   const blob = new Blob([byteArray], { type: "application/octet-stream" });
      //   return new File([blob], file.name);
      // });
  
      setFiles((prev) => [...prev, ...fileObjects]);
    } catch (error) {
      console.error("Error fetching and appending session files:", error);
      alert("Error fetching and appending session files, please try again.");
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
              className="d-flex justify-content-between align-items-center session-item"
              onClick={() => fetchAndAppendSessionFiles(session)}
            >
              <span style={listItemStyle}>{index === 0 ? 'Current Session' : session.fileNames.join(', ')}</span>
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFileVisibility(session.id);
                }}
              >
                {visibleFiles[session.id] ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
              </Button>
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
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
