import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import axios from "axios";

function FileUrlForm({ setSubmittedData }) {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const addUrl = () => {
    if (newUrl) {
      setUrls([...urls, newUrl]);
      setNewUrl("");
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const removeUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    if (files.length > 0 || urls.length > 0) {
      setIsLoading(true);
    } else {
      alert("Please upload at least one file or URL");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    urls.forEach((url, index) => formData.append(`urls[${index}]`, url));
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

      // Store the HTML content
      localStorage.setItem("htmlContent", response.data);

      setSubmittedData({
        files,
        urls,
      });
      setIsLoading(false);
      navigate("/chat");
    } catch (error) {
      console.error("There was an error!", error);
      alert("Error getting the the response, please try again");
      setIsLoading(false);
    }
  };

  const titleStyles = {
    marginTop: "0.5cm",
    textAlign: "center",
  };

  const logoStyles = {
    height: "5em",
    verticalAlign: "middle",
  };

  return (
    <>
      <div style={titleStyles}>
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          style={logoStyles}
        />
        <h1 style={{ display: "inline", marginLeft: "0.5cm" }}>
          Carnot Research
        </h1>
      </div>
      <h3
        style={{ marginTop: "0.5cm", marginBottom: "1cm", textAlign: "center" }}
      >
        Query any document or website
      </h3>
      <Container
        className="d-flex justify-content-center"
        style={{ minHeight: "40vh", marginBottom: "2cm" }}
      >
        <Card style={{ width: "70%" }}>
          <Card.Body>
            <Card.Title className="text-center">
              Upload Files or URLs
            </Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Upload Files</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter URL</Form.Label>
                <Form.Control
                  type="text"
                  value={newUrl}
                  onChange={handleUrlChange}
                  placeholder="Enter URL"
                />
                <Button className="mt-2" onClick={addUrl}>
                  Add URL
                </Button>
              </Form.Group>
              <div>
                {files.length > 0 && <h5>Files</h5>}
                {files.map((file, index) => (
                  <Row key={index} className="align-items-center">
                    <Col>{file.name}</Col>
                    <Col>
                      <Button
                        variant="danger"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
              <div>
                {urls.length > 0 && <h5>URLs</h5>}
                {urls.map((url, index) => (
                  <Row key={index} className="align-items-center">
                    <Col>{url}</Col>
                    <Col>
                      <Button variant="danger" onClick={() => removeUrl(index)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
              {isLoading ? (
                <progress className="mt-3 w-100" value={null} />
              ) : (
                <Button className="mt-3 w-100" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default FileUrlForm;
