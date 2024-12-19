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

function LeftMenu({ sessions }) {
  const [visibleFiles, setVisibleFiles] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const popupText = "Login to access this feature.";

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
      {sessions.length > 0 && <div className="mt-5"></div>}
      <RestrictedUpload />
      <ListGroup>
        {sessions.slice(0, 4).map((session, index) => (
          <div key={index}>
            <ListGroup.Item
              className={`d-flex justify-content-between session-item`}
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
                {sessions[0]?.fileNames?.map((file, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center file-item"
                  >
                    <span style={listItemStyle}>{file}</span>
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
      <Popup
        popupText={popupText}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    </div>
  );
}

export default LeftMenu;
