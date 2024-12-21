import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const WelcomePopup = ({ showPopup, setShowPopup }) => {
  const navigate = useNavigate();

  const handlePopupClose = () => setShowPopup(false);
  const handlePopupRedirect = () => {
    setShowPopup(false);
    navigate("/login");
  };
  return (
    <Modal show={showPopup} onHide={handlePopupClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <img src="logo_cisce.png" alt="" style={{ height: "3rem" }} /> Welcome
          to icarKno
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <b>
            Interact with secure knowledge container in your preferred language.
          </b>
        </p>
        <p>
          Click <b>Free Trial</b> to experience icarKno with a single file.
        </p>
        <p>OR</p>
        <p>
          Please <b>Login for Free</b> to experience the application with
          multiple files in a knowledge container.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ backgroundColor: "grey", color: "white" }}
          onClick={handlePopupClose}
        >
          Free Trial
        </Button>
        <Button
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={handlePopupRedirect}
        >
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomePopup;
