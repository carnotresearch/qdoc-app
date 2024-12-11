import React, { useState } from "react";
import { ListGroup, ButtonGroup, Button } from "react-bootstrap";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import "../../styles/sidebar.css";
import RestrictedUpload from "./RestrictedUpload";
import Popup from "./Popup";

function LeftMenu() {
  const [visibleFiles, setVisibleFiles] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const sessions = [];
  const selectedSessionFiles = [];

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

  return (
    <div>
      <RestrictedUpload />
      <ListGroup>
        {sessions.slice(0, 4).map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className={`d-flex justify-content-between session-item`}
              disabled={true}
              title={`${session.fileNames.join(", ")}`}
            >
              {session.name}
              <ButtonGroup>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowPopup(true)}
                >
                  <RiEdit2Line />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowPopup(true)}
                >
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

                <Button
                  className="mb-2 bg-secondary"
                  variant="secondary"
                  onClick={() => setShowPopup(true)}
                  style={addButtonStyle}
                >
                  <big>+</big> Add Files
                </Button>
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
    </div>
  );
}

export default React.memo(LeftMenu);
