import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Spinner } from "react-bootstrap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FileContext } from "./FileContext";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import "../styles/login.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const { setFiles } = useContext(FileContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.focusEmail) {
      emailInputRef.current.focus();
    }
  
    const handleScroll = () => {
      const footer = document.querySelector('.login-footer');
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const lastScrollTop = window.lastScrollTop || 0;
  
      if (currentScrollTop === 0) {
        footer.classList.remove('show-footer'); 
        return;
      }
  
      if (window.innerWidth <= 768) { 
        if (currentScrollTop > lastScrollTop) {
         
          footer.classList.add('show-footer'); 
        } else {
        
          footer.classList.remove('show-footer'); 
        }
      } else {
        footer.classList.add('show-footer'); 
      }
  
      window.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
              Deployable as containerised, secure and completely <br />
              on-site solution for corporate data; can be integrated <br />
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
            
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                id="email"
                placeholder="Email"

                ref={emailInputRef}
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
  <div className="hover-area">
    <a href="/forgot-password" className="forgot-pass-link">
      Forgot password?
    </a>
  </div>
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
   
<footer className="login-footer">
  <a className="Licon" href="https://www.linkedin.com/company/carnot-research-pvt-ltd/" target="_blank" rel="noopener noreferrer">
    <LinkedInIcon style={{ color: "#0072b1", marginRight: "2px" }} />
  </a>

  <span className="footer-separator">|</span>

  <a href="https://carnotresearch.com/terms.html" className="footer-link">
    Terms & Conditions
  </a>

  <span className="footer-separator">|</span>

  <a href="mailto:contact@carnotresearch.com" className="footer-link">
    Contact us for private/corporate deployment
  </a>
  <span className="footer-separator">|</span>

  <a href="https://carnotresearch.com/refund.html" className="footer-link">
    Refund Policy
  </a>
</footer>


    </div>
  );
};

export default Login;