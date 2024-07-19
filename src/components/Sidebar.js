import React, { useState } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";

function Sidebar({ prevfiles, urls = [], removeFile, removeUrl }) {
  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const handleFileChange = (event) => {
    setUploads([...event.target.files]);
  };

  const handleSubmit = () => {
    setFiles([...uploads]);
    console.log("uploads: ", uploads);
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
      {urls.length > 0 && <h2 style={marginStyle}>URLs</h2>}
      <ListGroup>
        {urls.map((url, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
            style={listStyle}
          >
            {url}
            {/* <Button variant="danger" size="sm" onClick={() => removeUrl(index)}>
              Remove
            </Button> */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
