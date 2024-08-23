import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Spinner } from "react-bootstrap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FileContext } from "./FileContext";
import "../styles/login.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const { setFiles } = useContext(FileContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusEmail && emailRef.current) {
      emailRef.current.focus();
    }
  }, [location]);

  const handleGoogleSubmit = async (googleToken) => {
    setIsLoading(true);
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/healthcheck`);
    } catch (error) {
      alert(
        "The backend server is not active. It'll be activated on request. Kindly contact contact@carnotresearch.com"
      );
      setIsLoading(false);
      return;
    }
    try {
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
      setFiles([]);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert("Error in login, kindly retry!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email is required");
      return;
    }
    if (!password) {
      alert("Password is required");
      return;
    }
    setIsLoading(true);
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/healthcheck`);
    } catch (error) {
      alert(
        "The backend server is not active. It'll be activated on request. Kindly contact contact@carnotresearch.com"
      );
      setIsLoading(false);
      return;
    }
    try {
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
      setFiles([]);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left text-center">
        <figure className="figure" style={{ color: "black" }}>
          <p className="m-1">
            <b>icarKno-chat</b> is a knowledge agent that allows you to query{" "}
            <br />
            multiple documents in diverse languages using natural language.
          </p>
          <img
            src="/computer-vision.png"
            alt=""
            className="figure-img img-fluid rounded"
          />
          <figcaption
            className="figure-caption"
            style={{ fontSize: "1rem", fontWeight: "bolder" }}
          >
            <p className="m-1">
              Deployable as containerised, secure and 100% on-premise <br />
              solution for corporate data security; can be integrated <br />
              with earmarked standalone drive or network storage
            </p>
          </figcaption>
        </figure>
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src="/logo.png" alt="" />
          </div>
          <div className="login-center">
            <h2>Carnot Research</h2>
            <p>icarKno-chat</p>
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
            Don't have an account?{" "}
            <a href="/register" className="sign-up">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
