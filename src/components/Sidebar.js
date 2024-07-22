import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListGroup, Form, Button } from "react-bootstrap";
import axios from "axios";
import { FileContext } from "./FileContext";

function Sidebar({ files = [] }) {
  const { setFiles } = useContext(FileContext);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setUploads([...event.target.files]);
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
          <Form.Label>Add Files</Form.Label>
          <Form.Control
            type="file"
            id="file"
            accept=".txt,.pdf,.docx"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Form.Group>
        {uploads.length > 0 && (
          <Button className="mt-3 w-100" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Form>
      {files.length > 0 && <h2 style={marginStyle}>Files</h2>}
      <ListGroup>
        {files.map((file, index) => (
          <a href="/" key={index}>
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center"
              style={listStyle}
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
          </a>
        ))}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
