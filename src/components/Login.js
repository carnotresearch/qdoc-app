import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { Spinner } from "react-bootstrap";
import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusEmail && emailRef.current) {
      emailRef.current.focus();
    }
  }, [location]);

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
      if (!recaptchaToken) {
        alert("ReCaptcha not validated");
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
      sessionStorage.setItem("googleauth", 0);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  const handlegoogleSubmit = async (tok) => {
    try {
      setIsLoading(true);
      const expiryTime = Date.now() + 3600 * 1000;
      sessionStorage.setItem("token", tok);
      sessionStorage.setItem("expiryTime", expiryTime.toString());
      sessionStorage.setItem("googleauth", 1);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  const onReCAPTCHAChange = (token) => {
    setRecaptchaToken(token);
  };

  const textStyles = {
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    padding: "10px",
  };

  return (
    <GoogleOAuthProvider clientId="936119028466-gbbi3ejafmef3o0u2ebo2j8v8me98qbi.apps.googleusercontent.com">
      <MDBContainer className="my-5 gradient-form align-items-center justify-content-center">
        <MDBRow>
          <MDBCol lg="6" md="12" sm="12" className="mb-5">
            <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4 background-image">
              <div
                className="text-white px-3 py-4 p-md-5 mx-md-4"
                style={textStyles}
              >
                <h2 className="mb-4">Welcome to Carnot Research</h2>
                <p className="large mb-0">
                  Empowering individuals and organizations to leverage cutting
                  edge research and enable innovation. Right Mix of academics
                  and industry professionals. Key differentiator is our ability
                  to provide managed research for serving your innovation needs.
                  Active in wide variety of research areas with major focus on
                  Computer Vision and NLP.
                </p>
                <p className="large mb-0">
                  <b>
                    This is a Multilingual Model to query documents with speech
                    capabilities.
                  </b>
                </p>
              </div>
            </div>
          </MDBCol>
          <MDBCol lg="6" md="12" sm="12" className="mb-5">
            <div className="d-flex flex-column">
              <div className="text-center">
                <img src="/logo.png" style={{ width: "185px" }} alt="logo" />
                <h4 className="mt-1 mb-5 pb-1">We are Carnot Research</h4>
              </div>

              <p>Please login to your account</p>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(jwtDecode(credentialResponse.credential));
                  handlegoogleSubmit(credentialResponse.credential);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="form1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={onReCAPTCHAChange}
              />

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn
                  className="mb-4 w-100 gradient-custom-2"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Sign-in"
                  )}
                </MDBBtn>
                <a className="text-muted" href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don't have an account?</p>
                <MDBBtn
                  outline
                  className="mx-2"
                  color="danger"
                  onClick={() => navigate("/register")}
                >
                  Register
                </MDBBtn>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </GoogleOAuthProvider>
  );
};

export default Login;
