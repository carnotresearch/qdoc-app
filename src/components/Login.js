import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, useLocation } from "react-router-dom";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { Spinner } from "react-bootstrap";
import "./styles.css";

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
      const response = await axios.post(
        "https://ndwli9gro8.execute-api.ap-south-1.amazonaws.com/default/validateUser",
        {
          email,
          password,
        }
      );
      console.log(response);
      const expiryTime = Date.now() + 3600 * 1000;
      sessionStorage.setItem("token", response.data.token);
      localStorage.setItem("expiryTime", expiryTime.toString());
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

  return (
    <MDBContainer className="my-5 gradient-form align-items-center justify-content-center">
      <h2 className="mb-4 ml-3 bold-text top-aligned"></h2>
      <MDBRow>
        <MDBCol lg="6" md="12" sm="12" className="mb-5">
          <div className="background-image">
            <p className="text-container typewriter-effect ">
              Empowering individuals and organizations to leverage cutting edge research and enable innovation.
              Right Mix of academics and industry professionals. Key differentiator is our ability to provide managed
              research for serving your innovation needs. Active in wide variety of research areas with major focus on
              Computer Vision and NLP.
            </p>
          </div>
        </MDBCol>
        <MDBCol lg="6" md="12" sm="12" className="mb-5">
          <div className="d-flex flex-column">
            <div className="text-center">
              <img src="/logo.png" style={{ width: "180px" }} alt="logo" />
            </div>
            <p>Please login to your account</p>
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
                className="mb- w-100 gradient-custom-2"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Sign in"
                )}
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
