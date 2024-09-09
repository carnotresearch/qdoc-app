import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { validatePassword } from "./utils/validationUtils";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpError, serOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (otp && otp.length !== 6) {
      serOtpError("OTP must be 6 characters long");
    } else {
      serOtpError("");
    }

    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [otp, newPassword, confirmNewPassword]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (otpError || passwordError || confirmPasswordError) {
        setMessage("Please fix the errors.");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_RESET_PASSWORD_URL}`,
        { email, otp, newPassword }
      );
      setIsLoading(false);
      setMessage(response.data.message);
      if (response.data.message === "Password reset successfull!") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset Password error", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to reset password");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4" 
      >Reset Password</h1>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {otpError && <small className="text-danger">{otpError}</small>}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {passwordError && (
            <small className="text-danger">{passwordError}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          {confirmPasswordError && (
            <small className="text-danger">{confirmPasswordError}</small>
          )}
        </div>
        <button type="submit" className="btn btn-primary"
         style={{ border: '2px solid black',
          marginTop: '14px',
          marginLeft: '13px',
          backgroundColor: 'transparent',
          color: 'black', 
         transition: 'border-color 0.3s ease' 
          }}
onMouseOver={(e) => e.currentTarget.style.borderColor = 'darkgrey'}
onMouseOut={(e) => e.currentTarget.style.borderColor = 'black'} >
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
