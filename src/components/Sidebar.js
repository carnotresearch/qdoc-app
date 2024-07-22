import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListGroup, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { FileContext } from "./FileContext";
// import "../styles/sidebar.css";

function Sidebar({ files = [] }) {
  const { setFiles } = useContext(FileContext);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setUploads([...event.target.files]);
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
    setUploads([...files]);
  };

  const handleSubmit = async () => {
    if (uploads.length > 0) {
      console.log("processing files");
    } else {
      alert("Please upload at least one file");
      return;
    }

    const formData = new FormData();
    uploads.forEach((file) => formData.append("files", file));
    const token = sessionStorage.getItem("token");
    formData.append("token", token);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      setFiles(uploads);
      navigate("/");
    } catch (error) {
      console.error("Error uploading files: ", error);
      alert("Error getting the the response, please try again");
    }

    fileInputRef.current.value = "";
    setUploads([]);
  };

  const renderFileDetails = () => {
    return uploads.map((file, index) => (
      <ListGroup.Item key={index}>
        {file.name} - {(file.size / 1024).toFixed(2)} KB
      </ListGroup.Item>
    ));
  };

  const marginStyle = { marginTop: "1.5cm" };
  const listStyle = {
    padding: "0.5rem",
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflow: "hidden",
  };

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
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Card
              className="p-1"
              style={{ border: "2px dashed #ccc", textAlign: "center" }}
            >
              <Card.Text>
                {"+ New Chat\nDrop files here"
                  .split("\n")
                  .map((text, index) => (
                    <div
                      key={index}
                      style={{ fontWeight: index === 0 ? "bold" : "normal" }}
                    >
                      {text}
                    </div>
                  ))}
              </Card.Text>
            </Card>
          </div>
        </Form.Group>
        {uploads.length > 0 && (
          <div className="mt-3">
            <ListGroup>{renderFileDetails()}</ListGroup>
            <Button className="mt-3 w-100" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        )}
      </Form>
      {/* {files.length > 0 && <h2 style={marginStyle}>Files</h2>} */}
      <ListGroup>
        {files.map((file, index) => (
          <ListGroup.Item
            className="d-flex justify-content-between align-items-center"
            style={listStyle}
            key={index}
          >
            {file.name}
            {/* <Button
              variant="danger"
              size="sm"
              onClick={() => removeFile(index)}
            >
              Remove
            </Button> */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
