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
          to icarKno Chat.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <b>
            Create your knowledge container by uploading any file and interact
            with it securely.
          </b>
        </p>
        <p>Use Free Trial to experience icarKno with a single file.</p>
        <p>Login to upload multiple files and interact.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handlePopupClose}>
          Free Trial
        </Button>
        <Button variant="primary" onClick={handlePopupRedirect}>
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomePopup;
