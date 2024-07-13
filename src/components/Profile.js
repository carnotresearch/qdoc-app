import React, { useState, useEffect } from "react";
import "./styles.css";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const token = sessionStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("Not logged in");
  const [paymentStatus, setPaymentStatus] = useState(null); // null means not checked yet

  useEffect(() => {
    // Decode the token and extract the username
    const token = sessionStorage.getItem("token");
    if (token) {
      const { email } = jwtDecode(token);
      setUsername(email);

      const expiryDate = sessionStorage.getItem("expiryDate");
      if (expiryDate) {
        sessionStorage.setItem("paymentStatus", 1);
        // setPaymentStatus(`Premium Plan (Untill ${expiryDate})`);
        setPaymentStatus("Premium plan");
      } else {
        setPaymentStatus("Free Trial");
        sessionStorage.setItem("paymentStatus", 0);
      }
    }
  }, [token]);

  return (
    <div className="App">
      <div className="icon" onClick={() => setShowPopup(!showPopup)}>
        👤
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
