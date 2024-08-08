import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import "./styles.css";

function Profile() {
  const token = sessionStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("Not logged in");
  const [paymentStatus, setPaymentStatus] = useState(null); 

  useEffect(() => {
    // Decode the token and extract the username
    if (token) {
      const { email } = jwtDecode(token);
      setUsername(email);

      const expiryDate = sessionStorage.getItem("expiryDate");
      if (expiryDate) {
        sessionStorage.setItem("paymentStatus", 1);
        setPaymentStatus("Premium plan");
      } else {
        setPaymentStatus("Free Trial");
        sessionStorage.setItem("paymentStatus", 0);
      }
    }
  }, [token]);

  return (
    <div className="profile-container">
      <div className="icon" onClick={() => setShowPopup(!showPopup)}>
        <AssignmentIndIcon fontSize="large" />
      </div>
      {showPopup && (
        <div className="popup">
          <p>{username}</p>
          {paymentStatus && <p>{paymentStatus}</p>}
        </div>
      )}
    </div>
  );
}

export default Profile;
