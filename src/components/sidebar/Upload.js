import React, { useRef } from "react";
import { Form, Card } from "react-bootstrap";
import { RiMessage2Fill } from "react-icons/ri";

const Upload = ({
  handleFileUpload,
  handleFileChange,
  isUploading,
  processTime,
}) => {
  const fileInputRef = useRef(null);

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

  const cardStyle = {
    border: "2px dashed #ccc",
    textAlign: "center",
    height: "50",
  };
  const marginStyle = { marginTop: "1.5cm" };
  return (
    <Form style={marginStyle}>
      <Form.Group className="mb-3">
        <div
          className="custom-file-input"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            id="file"
            accept=".txt,.pdf,.docx,.xlsx,.csv"
            multiple
            onChange={(event) => handleFileChange(event, false)}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Card className="p-1" style={cardStyle}>
            {isUploading ? (
              <div className="text-center">
                <video
                  src="/container.mp4"
                  loop
                  autoPlay
                  muted
                  style={{ width: "100%", height: "auto" }}
                />
                <p className="mb-0">
                  This may take up to {processTime} seconds...
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-0">
                  <RiMessage2Fill /> <b>New Container</b>
                </p>
                <p className="mb-0">Drop files here</p>
              </div>
            )}
          </Card>
        </div>
      </Form.Group>
    </Form>
  );
};

export default Upload;
