import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Spinner } from "react-bootstrap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "../styles/trialLogin.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const TrialLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  // const handleGoogleSubmitRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusEmail && emailRef.current) {
      emailRef.current.focus();
    }
  }, [location]);

  const handleGoogleSubmit = async (googleToken) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_GOOGLE_LOGIN_URL}`,
        { googleToken }
      );
      const expiryTime = Date.now() + 3600 * 1000;
      sessionStorage.setItem("token", response.data.token);
      if (response.data.expiryDate) {
        sessionStorage.setItem("expiryDate", response.data.expiryDate);
      }
      sessionStorage.setItem("expiryTime", expiryTime.toString());
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  // Goolge login through script
  // handleGoogleSubmitRef.current = handleGoogleSubmit;
  // useEffect(() => {
  //   // Initialize the Google Sign-In client
  //   window.google.accounts.id.initialize({
  //     client_id: clientId,
  //     callback: (response) => handleGoogleSubmitRef.current(response),
  //   });
  // }, []);

  // const handleGoogleLogin = () => {
  //   window.google.accounts.id.prompt();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("Email is required");
        return;
      }
      if (!password) {
        alert("Password is required");
        return;
      }
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_LOGIN_URL}`, {
        email,
        password,
      });
      const expiryTime = Date.now() + 3600 * 1000;
      sessionStorage.setItem("token", response.data.token);
      if (response.data.expiryDate) {
        sessionStorage.setItem("expiryDate", response.data.expiryDate);
      }
      sessionStorage.setItem("expiryTime", expiryTime.toString());
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img
          src="/computer-vision.png"
          alt=""
          style={{ borderRadius: "20px" }}
        />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src="/logo.png" alt="" />
          </div>
          <div className="login-center">
            <h2>Carnot Research</h2>
            <p>Welcome!</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                id="email"
                placeholder="Email"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="login-center-options">
                <a href="/forgot-password" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Log In"
                  )}
                </button>
                {/* <button type="button" onClick={handleGoogleLogin}>
                  <img src="/icons8-google.svg" alt="" />
                  Log In with Google
                </button> */}
                <div style={{ margin: "auto" }}>
                  <GoogleOAuthProvider clientId={clientId}>
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        handleGoogleSubmit(credentialResponse.credential);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialLogin;
