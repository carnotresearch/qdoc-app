import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";

const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const handleOpenHtml = () => {
    const htmlContent = localStorage.getItem("htmlContent");
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
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
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
        QDoc App
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
                  <b>About Us</b>
                </a>
              </li>
              {location.pathname === "/chat" && (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-dark"
                      style={{ marginRight: "0.25cm" }}
                      onClick={handleOpenHtml}
                    >
                      Graph
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
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  style={{ marginRight: "0.25cm" }}
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
