import React, { useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { validateEmail, validatePassword } from "./utils/validationUtils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }

    if (otp && otp.length !== 6) {
      setOtpError("Otp must be 6 characters long only");
    } else {
      setOtpError("");
    }

    if (password && !validatePassword(password)) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [email, otp, password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        if (emailError) {
          setErrorMessage("Please fix the errors before submitting.");
          return;
        }
        if (!recaptchaToken) {
          setErrorMessage("Kindly verify recaptcha first!");
          return;
        }
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_SEND_OTP_URL}`,
          { email, recaptchaToken, action: "register" }
        );
        if (response.status === 200) {
          setStep(2);
        }
        setIsLoading(false);
      } else if (step === 2) {
        if (otpError || passwordError || confirmPasswordError) {
          setErrorMessage("Please fix the errors before submitting.");
          return;
        }
        setIsLoading(true);
        await axios.post(`${process.env.REACT_APP_REGISTER_URL}`, {
          email,
          otp,
          password,
        });
        setIsLoading(false);
        navigate("/login");
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Registration error", error);
      // Check if error response is available and set the error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const onReCAPTCHAChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Register</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleRegister}>
        {step === 1 && (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <small className="text-danger">{emailError}</small>
              )}
            </div>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={onReCAPTCHAChange}
            />
          </>
        )}
        {step === 2 && (
          <>
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPasswordError && (
                <small className="text-danger">{confirmPasswordError}</small>
              )}
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary"
          style={{ border: '2px solid black',
            backgroundColor: 'transparent',
    color: 'black', 
    transition: 'border-color 0.3s ease' 
  }}
  onMouseOver={(e) => e.currentTarget.style.borderColor = 'darkgrey'}
  onMouseOut={(e) => e.currentTarget.style.borderColor = 'black'} 
            >
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : step === 1 ? (
            "Send OTP"
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
