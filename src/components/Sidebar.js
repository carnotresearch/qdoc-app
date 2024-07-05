import React from "react";
import { ListGroup } from "react-bootstrap";

function Sidebar({ files, urls, removeFile, removeUrl }) {
  const marginStyle = { marginTop: "1.5cm" };
  const listStyle = {
    padding: "0.5rem",
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflow: "hidden",
  };
  return (
    <div>
      {files.length > 0 && <h2 style={marginStyle}>Files</h2>}
      <ListGroup>
        {files.map((file, index) => (
          <ListGroup.Item
            key={index}
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
