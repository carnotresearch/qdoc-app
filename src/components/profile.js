import React, { useState, useEffect } from 'react';
import './styles.css';
import {jwtDecode} from 'jwt-decode';

function Profile() {
  const token = sessionStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("Not logged in");
  const [paymentStatus, setPaymentStatus] = useState(null); // null means not checked yet

  useEffect(() => {
    // Decode the token and extract the username
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.email); // Assuming the payload contains an 'email' field

        // Fetch payment status from the backend
        fetch('http://127.0.0.1:5000/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: decodedToken.email }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'paid') {
              sessionStorage.setItem('paymentStatus', 1);
              setPaymentStatus('Paid Plan');
            } else {
              setPaymentStatus('Free Account');
              sessionStorage.setItem('paymentStatus', 0);
            }
          })
          .catch(error => {
            console.error('Error fetching payment status:', error);
            setPaymentStatus('Error fetching status');
          });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUsername("Invalid token");
        setPaymentStatus(null);
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