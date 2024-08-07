import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
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
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <Profile />
      <Link
        className="navbar-brand"
        style={{ marginLeft: "0.5cm", color: "" }}
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
        <ArrowDropDownIcon style={{ fontSize: '2rem' }} />
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
            <button
              className="btn dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              style={{
                borderRadius: '10%',
                padding: '10px',
                fontSize: '2rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: 'none', 
                transform: 'translateY(-15px)' 
              }}
              onFocus={(e) => e.target.blur()} 
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
