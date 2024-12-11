import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Popup = ({ showPopup, setShowPopup, popupText }) => {
  const navigate = useNavigate();

  const handlePopupClose = () => setShowPopup(false);
  const handlePopupRedirect = () => {
    setShowPopup(false);
    navigate("/login");
  };
  return (
    <Modal show={showPopup} onHide={handlePopupClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {popupText} You will be redirected to the login page.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handlePopupClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePopupRedirect}>
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
