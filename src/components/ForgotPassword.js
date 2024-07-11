import React, { useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "./utils/validationUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }, [email]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (emailError) {
        setMessage("Please fix the errors");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_SEND_OTP_URL}`,
        { email, recaptchaToken, action: "reset" }
      );
      setMessage(response.data.message);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Forgot Password error", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to send OTP");
      }
    }
  };

  const onReCAPTCHAChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Forgot Password</h1>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <small className="text-danger">{emailError}</small>}
        </div>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={onReCAPTCHAChange}
        />
        <button type="submit" className="btn btn-primary">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
