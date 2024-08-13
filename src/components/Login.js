import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Spinner } from "react-bootstrap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import moment from "moment-timezone";
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
      setFiles([]);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert("Error in login, kindly retry!");
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
      setFiles([]);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  // Convert IST timings to local time and get timezone code
  const convertISTtoLocal = (hour, minute) => {
    // Create a moment object in IST
    const istTime = moment.tz({ hour, minute }, "Asia/Kolkata");

    // Convert IST time to local time
    const localTime = istTime.clone().tz(moment.tz.guess());

    // Format the time and extract the timezone abbreviation
    const time = localTime.format("HH:mm"); // 24-hour format
    const timezone = localTime.format("z"); // Timezone abbreviation

    return { time, timezone };
  };

  // Define your local timings based on IST
  const { time: localStartTime, timezone } = convertISTtoLocal(11, 0); // 11:00 AM IST
  const { time: localEndTime } = convertISTtoLocal(22, 0); // 10:00 PM IST
  console.log("here: ", timezone);

  const noticeStyles = {
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "0",
  };

  return (
    <div>
      <p style={noticeStyles}>
        This is beta testing. The website will be available from{" "}
        {localStartTime} to {localEndTime} {timezone} only.
      </p>
      <div className="login-main">
        <div className="login-left text-center">
          <figure className="figure" style={{ color: "black" }}>
            <p className="m-1">
              iCarKno-chat is a knowledge agent that allows you
            </p>
            <p>to query multiple documents in diverse languages.</p>
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
                Deployable as containerised, secure and 100% on-premise{" "}
              </p>
              <p className="m-1">
                solution for corporate data security; can be integrated
              </p>
              <p>with earmarked standalone drive or network storage</p>
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
              <p>iCarKno-chat</p>
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
    </div>
  );
};

export default Login;
