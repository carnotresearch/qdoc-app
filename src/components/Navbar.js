import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tooltip from "@mui/material/Tooltip"; // Add Tooltip from Material UI
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

  // State for the temperature slider, loaded from sessionStorage if available
  const [temperature, setTemperature] = useState(
    sessionStorage.getItem("temperature") || 0.2
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Save temperature to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("temperature", temperature);
  }, [temperature]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const languages = [
    { value: "23", label: "English" },
    { value: "1", label: "Hindi" },
    // other languages
  ];

  return (
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
          {/* Dropdown for Temperature Settings */}
          <li className="nav-item dropdown">
            <button className="btn" onClick={toggleDropdown}>
              <SettingsIcon /> {/* Replace text with Settings Icon */}
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
                  <Tooltip title="Adjusts how creative the model's responses are. Higher values make responses more varied." arrow>
                    <InfoIcon style={{ marginLeft: "5px", cursor: "pointer" }} /> {/* Info Icon with Tooltip */}
                  </Tooltip>
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
  );
};

export default Navbar;
