import React, { useState, useRef, useContext } from "react";
import { ListGroup, ButtonGroup, Button } from "react-bootstrap";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import { FileContext } from "../FileContext";
import "../../styles/sidebar.css";
import { fetchFilesFromS3 } from "../utils/presignedUtils";
import DisabledUpload from "./DisabledUpload";
import axios from "axios";

function LeftMenu({ sessions, selectedSessionFiles, setIsFileUploaded }) {
  const { setFiles } = useContext(FileContext);
  const additionalFileInputRef = useRef(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYW5hdkBjYXJub3RyZXNlYXJjaC5jb20iLCJpYXQiOjE3MzM3NTY5MjIsImV4cCI6MTczMzc2MDUyMn0.8ngRubqw8MbKHeJkRdxxeZRpEzT_WXGXotZXoN5iBmU";
  const [visibleFiles, setVisibleFiles] = useState({});
  const [latestSessionId, setLatestSessionId] = useState("");

  const addButtonStyle = {
    color: "white",
    width: "100%",
    fontSize: "0.875rem",
  };

  const listItemStyle = {
    flexGrow: 1,
    marginRight: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.875rem",
  };

  const toggleFileVisibility = (session) => {
    setVisibleFiles((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (key !== session) {
          newState[key] = false;
        }
      }
      newState[session] = !newState[session];
      return newState;
    });
  };

  const fetchAndAppendSessionFiles = async (session) => {
    try {
      setLatestSessionId(session.id);
      axios.post(
        `${process.env.REACT_APP_UPDATE_TIMESTAMP}`,
        { token, sessionId: session.id },
        { headers: { "Content-Type": "application/json" } }
      );
      // Auto-expand the selected session
      setVisibleFiles((prevState) => {
        const newState = { ...prevState };
        for (const key in newState) {
          newState[key] = false; // Collapse all other sessions
        }
        newState[session.id] = true; // Expand the selected session
        return newState;
      });
      sessionStorage.setItem("sessionId", session.id);
      // fetch files from s3
      const files = await fetchFilesFromS3(token, session.id);
      setFiles(files);
      setIsFileUploaded(true);
    } catch (error) {
      console.error("Error fetching and appending session files:", error);
    }
  };

  const formatSessionDate = (sessionId) => {
    const date = new Date(
      sessionId.slice(0, 4),
      sessionId.slice(4, 6) - 1,
      sessionId.slice(6, 8)
    );
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <DisabledUpload />
      <ListGroup>
        {sessions.slice(0, 4).map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className={`d-flex justify-content-between session-item ${
                session.id === latestSessionId ? "latest-container" : ""
              }`}
              onClick={() => fetchAndAppendSessionFiles(session)}
              title={`${formatSessionDate(
                session.id
              )} - ${session.fileNames.join(", ")}`}
            >
              {session.name}
              <ButtonGroup>
                <Button variant="outline-primary" size="sm" disabled={true}>
                  <RiEdit2Line />
                </Button>
                <Button variant="outline-danger" size="sm" disabled={true}>
                  <RiDeleteBinLine />
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  disabled={true}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFileVisibility(session.id);
                  }}
                >
                  {visibleFiles[session.id] ? (
                    <RiArrowDropUpLine />
                  ) : (
                    <RiArrowDropDownLine />
                  )}
                </Button>
              </ButtonGroup>
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

                {session.id === latestSessionId && (
                  <Button
                    className="mb-2 bg-secondary"
                    variant="secondary"
                    onClick={() => additionalFileInputRef.current.click()}
                    style={addButtonStyle}
                  >
                    <big>+</big> Add Files
                  </Button>
                )}
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
    </div>
  );
}

export default React.memo(LeftMenu);
