import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import { MDBBtn } from "mdb-react-ui-kit";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";

const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  darkMode,
  setDarkMode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const paid = sessionStorage.getItem("paymentStatus");
  // const [isLoading, setIsLoading] = useState(false);
  // const [isGenerated, setIsGenerated] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  // const handleGenerateGraph = async () => {
  //   setIsLoading(true);
  //   console.log("This feature is not live yet!");
  //   setIsLoading(false);
  //   setIsGenerated(true);
  // TODO
  // move to sidebar.js
  // setIsLoading(true);
  // try {
  //   // prepare request data
  //   const formData = new FormData();
  //   const files = submittedData.files;
  //   const urls = submittedData.urls;
  //   files.forEach((file) => formData.append("files", file));
  //   urls.forEach((url, index) => formData.append(`urls[${index}]`, url));
  //   const token = sessionStorage.getItem("token");
  //   formData.append("token", token);

  //   // API call
  //   const response = await axios.post(
  //     `${process.env.REACT_APP_BACKEND_URL}/graph`,
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );

  //   // store graph in session storage
  //   sessionStorage.setItem("graphContent", response.data);
  //   setIsLoading(false);
  //   setIsGenerated(true);
  // } catch (error) {
  //   setIsLoading(false);
  //   console.error("There was an error!", error);
  //   alert("Error generating graph, please try again");
  // }
  // };

  // const handleOpenHtml = () => {
  //   // open graph from session storage
  //   const graphContent = sessionStorage.getItem("graphContent");
  //   const newWindow = window.open();
  //   newWindow.document.write(graphContent);
  //   newWindow.document.close();
  // };

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
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <Profile />
      <Link
        className="navbar-brand"
        style={{ marginLeft: "0.5cm", color: "white" }}
        to="/"
      >
        iCarKno-chat
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              href="https://carnotresearch.com/#section-about"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Us
            </a>
          </li>
          {location.pathname === "/" && (
            <>
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
                <button className="btn btn-purple">Upgrade</button>
              </Link>
            </li>
          )}
          <li className="nav-item">
            {token ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </li>
          <li className="nav-item">
            <MDBBtn
              variant="outline-secondary"
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </MDBBtn>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
