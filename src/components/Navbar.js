import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import BookIcon from "@mui/icons-material/Book"; // Add this for book icon
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
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
  const paid = sessionStorage.getItem("paymentStatus");

  const [temperature, setTemperature] = useState(
    sessionStorage.getItem("temperature") || 0.2
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mode, setMode] = useState(
    sessionStorage.getItem("answerMode") || "contextual"
  );
  const [isManualOpen, setIsManualOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("temperature", temperature);
  }, [temperature]);

  useEffect(() => {
    if (mode === "contextual") {
      sessionStorage.setItem("answerMode", 1);
    } else if (mode === "creative") {
      sessionStorage.setItem("answerMode", 2);
    }
  }, [mode]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    sessionStorage.removeItem("answerMode");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openManual = () => {
    setIsManualOpen(true);
  };

  const closeManual = () => {
    setIsManualOpen(false);
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
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        <Profile />
        <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
          icarKno
          <span
            style={{
              verticalAlign: "super",
              fontSize: "0.5rem",
              top: "-0.2rem",
              position: "relative",
            }}
          >
            TM
          </span>{" "}
          Chat
        </Link>

        {/* User Manual Button - Centered and with Book Icon */}
        <div className="mx-auto">
          <button className="btn btn-user-manual" onClick={openManual}>
            <BookIcon style={{ marginRight: "0.2rem" }} />
            User Manual
          </button>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <ArrowDropDownIcon
            style={{ fontSize: "2rem", marginLeft: "-0.5rem" }}
          />
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
            {location.pathname === "/" && paid === "0" && (
              <li className="nav-item">
                <Link to="/payment">
                  <button className="btn btn-purple">Upgrade</button>
                </Link>
              </li>
            )}
            {/* Dropdown for Temperature Settings and Mode */}
            <li className="nav-item dropdown">
              <button className="btn" onClick={toggleDropdown}>
                <SettingsIcon />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu show">
                  <div className="temperature-slider">
                    <label htmlFor="temperature" className="form-label">
                      Temperature: {temperature}
                    </label>
                    <input
                      type="range"
                      id="temperature"
                      className="form-range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                    />
                    <Tooltip
                      title="Adjusts how creative the model's responses are. Higher values make responses more varied."
                      arrow
                    >
                      <InfoIcon
                        style={{ marginLeft: "5px", cursor: "pointer" }}
                      />
                    </Tooltip>
                  </div>

                  {/* Mode Selection */}
                  <div className="mode-selection">
                    <label className="form-label">Answer Mode</label>
                    <div>
                      <input
                        type="radio"
                        id="contextual"
                        name="mode"
                        value="contextual"
                        checked={mode === "contextual"}
                        onChange={() => setMode("contextual")}
                      />
                      <label htmlFor="contextual">Contextual Mode</label>
                      <Tooltip
                        title="Contextual Mode: Answers based on provided context, strictly sticking to the information given."
                        arrow
                      >
                        <InfoIcon
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="creative"
                        name="mode"
                        value="creative"
                        checked={mode === "creative"}
                        onChange={() => setMode("creative")}
                      />
                      <label htmlFor="creative">Creative Answering Mode</label>
                      <Tooltip
                        title="Creative Answering Mode: Provides more imaginative, inferred responses based on context and creativity."
                        arrow
                      >
                        <InfoIcon
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/" ? (
                <button className="btn login-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button
                  className="btn login-logout-btn"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              )}
            </li>
            <li className="nav-item">
              <button
                className="dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Brightness7Icon /> : <DarkModeIcon />}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Manual Popup */}
      {isManualOpen && (
        <div className="user-manual-modal">
          <div className="user-manual-content">
            <button className="close-btn" onClick={closeManual}>
              <CloseIcon />
            </button>
            <h2>User Manual</h2>
            {/* Add the user manual content here */}
            <p>The detailed user manual will be added here.</p>
            {/* Close button at the bottom */}
            <button className="btn btn-close-manual" onClick={closeManual}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
