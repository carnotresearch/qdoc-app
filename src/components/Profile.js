import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import "../styles/profile.css";

function Profile() {
  const token = sessionStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("Not logged in");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [expiryDateFormatted, setExpiryDateFormatted] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (token) {
      const { email } = jwtDecode(token);
      setUsername(email);

      const expiryDate = sessionStorage.getItem("expiryDate");

      if (expiryDate) {
        // Set payment status to Premium
        sessionStorage.setItem("paymentStatus", 1);
        setPaymentStatus("Premium plan");

        // Parse the expiry date (assumes YYYYMMDD format)
        const year = parseInt(expiryDate.slice(0, 4), 10);
        const month = parseInt(expiryDate.slice(4, 6), 10) - 1; // JS months are 0-indexed
        const day = parseInt(expiryDate.slice(6, 8), 10);

        const expiryDateObj = new Date(year, month, day);

        // Format the date into "day Month year"
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = expiryDateObj.toLocaleDateString(
          "en-US",
          options
        );
        setExpiryDateFormatted(formattedDate);

        // Calculate days left until expiration
        const currentDate = new Date();
        const timeDifference = expiryDateObj - currentDate;
        const daysDifference = Math.ceil(
          timeDifference / (1000 * 60 * 60 * 24)
        ); // Convert milliseconds to days

        setDaysLeft(daysDifference >= 0 ? daysDifference : 0); // Ensure no negative values
      } else {
        // Free trial
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
          <p className="username">{username}</p>
          {paymentStatus && (
            <p
              className={`payment-status ${
                paymentStatus === "Premium plan" ? "premium" : "free"
              }`}
            >
              {paymentStatus}
            </p>
          )}
          {expiryDateFormatted && (
            <div className="plan-expiry">
              <p>Plan expires on {expiryDateFormatted}</p>
              <p className="days-left">{daysLeft} days left until expiration</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
