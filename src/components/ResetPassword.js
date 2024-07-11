import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { validatePassword } from "./utils/validationUtils";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpError, serOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
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
      if (otpError || passwordError || confirmPasswordError) {
        setMessage("Please fix the errors.");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_RESET_PASSWORD_URL}`,
        { email, otp, newPassword }
      );
      setMessage(response.data.message);
      if (response.data.message === "Password reset successfully") {
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
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Reset Password</h1>
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
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
