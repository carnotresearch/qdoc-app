import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { RiMessage2Fill } from "react-icons/ri";
import Popup from "./Popup";

const DisabledUpload = () => {
  const isUserLoggedIn = false;
  const [showPopup, setShowPopup] = useState(false);
  const popupText = "Please login to upload files.";

  const cardStyle = {
    border: "2px dashed #ccc",
    textAlign: "center",
    height: "50",
  };
  const marginStyle = { marginTop: "1.5cm" };

  const handleUnauthorizedInteraction = () => {
    if (!isUserLoggedIn) {
      setShowPopup(true);
    }
  };

  return (
    <>
      <Form style={marginStyle}>
        <Form.Group className="mb-3">
          <div
            className="custom-file-input"
            onClick={handleUnauthorizedInteraction}
            onDragOver={(e) => {
              e.preventDefault();
              handleUnauthorizedInteraction();
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleUnauthorizedInteraction();
            }}
          >
            <Card className="p-1" style={cardStyle}>
              <div>
                <p className="mb-0">
                  <RiMessage2Fill /> <b>New Container</b>
                </p>
                <p className="mb-0">Drop files here</p>
              </div>
            </Card>
          </div>
        </Form.Group>
      </Form>

      <Popup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        popupText={popupText}
      />
    </>
  );
};

export default DisabledUpload;
