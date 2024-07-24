import React, { useState, useRef, useContext} from "react";
import { ListGroup, Form, Button, Card, CloseButton, Spinner } from "react-bootstrap";
import axios from "axios";
import { FileContext } from "./FileContext";

function Sidebar({ files = [] }) {
  const { setFiles } = useContext(FileContext);

  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (event, isAdditionalUpload = false) => {
    if (isAdditionalUpload) {
      handleAdditionalFileUpload(event.target.files);
    } else {
      handleFileUpload(event.target.files, false);
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
    handleFileUpload(files, false);
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
      setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    } catch (error) {
      console.error("Error uploading files:", error);
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
      // Handle the error (e.g., show an error message to the user)
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
              accept=".txt,.pdf,.docx"
              multiple
              onChange={(event) => handleFileChange(event, false)}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Card
              className="p-1"
              style={{ border: "2px dashed #ccc", textAlign: "center" }}
            >
              {"+ New Chat\nDrop files here".split("\n").map((text, index) => (
                <div
                  key={index}
                  style={{ fontWeight: index === 0 ? "bold" : "normal" }}
                >
                  {text}
                </div>
              ))}
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
