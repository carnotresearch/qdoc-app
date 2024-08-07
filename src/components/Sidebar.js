import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListGroup,
  Form,
  Button,
  Card,
  CloseButton,
  Spinner,
} from "react-bootstrap";
import { RiMessage2Fill } from "react-icons/ri";
import axios from "axios";
import { FileContext } from "./FileContext";

function Sidebar({ files = [] }) {
  const { setFiles } = useContext(FileContext);
  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processTime, setProcessTime] = useState(10);
  const navigate = useNavigate();

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
    // Converting bytes to MB and mulitply by 20 for avg
    const estimated_time = Math.floor(size / (1024 * 1024)) * 20;
    if (estimated_time > 10) {
      setProcessTime(estimated_time);
    }

    const filesArray = Array.from(files);
    const formData = new FormData();
    filesArray.forEach((file) => formData.append("files", file));
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
      setFiles([...filesArray]);
    } catch (error) {
      console.error("Error uploading files:", error);
      if (error.response && error.response.status === 401) {
        setFiles([]);
        alert("User session is expired!");
        navigate("/login");
      }
      alert("Error uploading files, please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalFileUpload = async (files) => {
    const filesArray = Array.from(files);
    const formData = new FormData();
    filesArray.forEach((file) => formData.append("files", file));
    const token = sessionStorage.getItem("token");
    formData.append("token", token);

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/add-upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    } catch (error) {
      console.error("Error uploading additional files:", error);
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
      alert("Couldn't uplaod file, kindly retry!");
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
                    This may take upto {processTime} seconds...
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
    </div>
  );
}

export default Sidebar;
