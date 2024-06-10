import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      if (!recaptchaToken) {
        console.log("no captcha");
        return;
      }
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
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      alert("Login error");
    }
  };

  const onReCAPTCHAChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <MDBContainer className="my-5 gradient-form align-items-center justify-content-center">
      <MDBRow>
        <MDBCol className="mb-5">
          <div className="d-flex flex-column">
            <div className="text-center">
              <img src="/logo.png" style={{ width: "185px" }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">We are Carnot Research</h4>
            </div>

            <p>Please login to your account</p>

            <MDBInput
              wrapperClass="mb-4"
              label="Username"
              id="form1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              >
                Sign in
              </MDBBtn>
              <a className="text-muted" href="#">
                Forgot password?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className="mx-2" color="danger">
                Register
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
