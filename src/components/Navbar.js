import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./profile";
import axios from "axios";
import '../styles/navbar.css'
const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  submittedData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const paid = sessionStorage.getItem("paymentStatus");
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    sessionStorage.removeItem("googleauth");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const handleOpenHtml = async () => {
    const formData = new FormData();
    const files = submittedData.files;
    const urls = submittedData.urls;
    files.forEach((file) => formData.append("files", file));
    urls.forEach((url, index) => formData.append(`urls[${index}]`, url));
    const token = sessionStorage.getItem("token");
    formData.append("token", token);
    const googleauth = sessionStorage.getItem("googleauth");
    formData.append("googleauth", googleauth);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/graph`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const htmlContent = response.data;
      const newWindow = window.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } catch (error) {
      console.error("There was an error!", error);
      alert("Error generating graph, please try again");
    }
  };

  const languages = [
    { value: "23", label: "English" },
    { value: "1", label: "Hindi" },
    { value: "2", label: "Gom" },
    { value: "3", label: "Kannada" },
    { value: "4", label: "Dogri" },
    { value: "5", label: "Bodo" },
    { value: "6", label: "Urdu" },
    { value: "7", label: "Tamil" },
    { value: "8", label: "Kashmiri" },
    { value: "9", label: "Assamese" },
    { value: "10", label: "Bengali" },
    { value: "11", label: "Marathi" },
    { value: "12", label: "Sindhi" },
    { value: "13", label: "Maithili" },
    { value: "14", label: "Punjabi" },
    { value: "15", label: "Malayalam" },
    { value: "16", label: "Manipuri" },
    { value: "17", label: "Telugu" },
    { value: "18", label: "Sanskrit" },
    { value: "19", label: "Nepali" },
    { value: "20", label: "Santali" },
    { value: "21", label: "Gujarati" },
    { value: "22", label: "Odia" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <Profile />
      <Link
        className="navbar-brand"
        style={{ marginLeft: "0.5cm", color: "white" }}
        to="/"
      >
        QDoc Chat
      </Link>
      <ul className="navbar-nav ms-auto">
        {token ? (
          <>
            <button
              className="navbar-toggler btn btn-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse ms-auto" id="navbarNav">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://carnotresearch.com/#section-about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b style={{ color: "white" }}>About Us ↗</b>
                </a>
              </li>
              {location.pathname === "/chat" && (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-graph"
                      style={{ marginRight: "0.25cm" }}
                      onClick={handleOpenHtml}
                    >
                      Graph ↗
                    </button>
                  </li>
                  <LanguageDropdown
                    label="Input"
                    selectedLanguage={
                      languages.find((lang) => lang.value === inputLanguage)
                        ?.label || "English"
                    }
                    languages={languages}
                    onChange={setInputLanguage}
                  />
                  <LanguageDropdown
                    label="Output"
                    selectedLanguage={
                      languages.find((lang) => lang.value === outputLanguage)
                        ?.label || "English"
                    }
                    languages={languages}
                    onChange={setOutputLanguage}
                  />
                </>
              )}
              {paid === "0" && (
                <li className="nav-item">
                  <Link to="/payment">
                    <button
                      className="btn btn-purple"
                      style={{ marginRight: "0.25cm" }}
                    >
                      Upgrade
                    </button>
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  style={{ marginRight: "0.25cm", color : "white" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </div>
          </>
        ) : (
          <li className="nav-item">
            <button
              style={{ marginRight: "0.5cm" }}
              className="btn btn-primary"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
