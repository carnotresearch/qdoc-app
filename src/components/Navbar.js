import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LanguageGridSelector from "./LanguageGridSelector";
import Profile from "./Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "../styles/navbar.css";
import UserManual from "./UserManual";

const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  darkMode,
  setDarkMode,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [mode, setMode] = useState(
    sessionStorage.getItem("answerMode") === "2" ? "creative" : "contextual"
  );

  useEffect(() => {
    if (mode === "contextual") {
      sessionStorage.setItem("answerMode", "1");
    } else if (mode === "creative") {
      sessionStorage.setItem("answerMode", "2");
    }
  }, [mode]);

  useEffect(() => {
    if (isLargeScreen) {
      handleCloseMenu();
    }
  }, [isLargeScreen]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    sessionStorage.removeItem("answerMode");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginClick = () => {
    handleCloseMenu();
    navigate("/login", { state: { focusEmail: true } });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handle User Manual Dialog
  const handleManualOpen = () => {
    setOpenManualDialog(true);
  };

  const handleManualClose = () => {
    setOpenManualDialog(false);
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

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === "creative" ? "contextual" : "creative"
    );
  };
  useEffect(() => {
    if (isLargeScreen) {
      handleCloseMenu();
    }
  }, [isLargeScreen]);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  });

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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Mode Toggle */}
            <li className="nav-item">
              <div className="mode-toggle">
                <div
                  className={`toggle-container ${mode} ${
                    darkMode ? "dark-mode" : ""
                  }`}
                  onClick={toggleMode}
                >
                  <div
                    className="option contextual-option"
                    onClick={() => setMode("contextual")}
                  >
                    Contextual
                  </div>
                  <div className="slider">
                    <div className="dots"></div>
                  </div>
                  <div
                    className="option creative-option"
                    onClick={() => setMode("creative")}
                  >
                    Creative
                  </div>
                </div>
                <Tooltip
                  title={
                    mode === "creative"
                      ? "Creative Mode: Provides more imaginative, inferred responses based on context and creativity."
                      : "Contextual Mode: Answers based on provided context, strictly sticking to the information given."
                  }
                  arrow
                >
                  <InfoIcon style={{ cursor: "pointer", marginLeft: "4px" }} />
                </Tooltip>
              </div>
            </li>

            {/* About Us Link */}
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

            {/* User Manual Button */}
            <li className="nav-item">
              <Button
                color="primary"
                startIcon={<MenuBookIcon />}
                onClick={handleManualOpen}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  margin: "0 8px",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Help
              </Button>
            </li>

            {/* Pricing Link */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/pricing">
                  Pricing
                </Link>
              </li>
            )}

            {location.pathname === "/" && (
              <>
                <LanguageGridSelector
                  label="Input"
                  selectedLanguage={
                    languages.find((lang) => lang.value === inputLanguage)
                      ?.label || "English"
                  }
                  languages={languages}
                  onChange={setInputLanguage}
                  darkMode={darkMode}
                />
                <LanguageGridSelector
                  label="Output"
                  selectedLanguage={
                    languages.find((lang) => lang.value === outputLanguage)
                      ?.label || "English"
                  }
                  languages={languages}
                  onChange={setOutputLanguage}
                  darkMode={darkMode}
                />
              </>
            )}

            <li className="nav-item">
              {isLoggedIn ? (
                <button
                  className="btn login-logout-btn"
                  style={{ cursor: "pointer", marginLeft: "-1px" }}
                  onClick={handleLogout}
                >
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

        {/* Navbar toggle button for mobile view */}
        <Button
          className="navbar-toggler d-lg-none"
          onClick={handleMenuClick}
          style={{
            border: `2px solid ${darkMode ? "white" : "black"}`,
            borderRadius: "6px",
            padding: "2px",
            color: darkMode ? "white" : "black",
          }}
        >
          <ArrowDropDownIcon
            style={{ fontSize: "2rem", color: darkMode ? "white" : "black" }}
          />
        </Button>

        {/* Mobile Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              width: "200px",
              backgroundColor: darkMode ? "#424242" : "#f5f5f5",
              color: darkMode ? "white" : "black",
              zIndex: 1300,
            },
          }}
          MenuListProps={{
            style: {
              padding: "10px",
            },
          }}
        >
          {/* Mode Toggle */}
          <MenuItem className="menu-item">
            <div className="mode-toggle">
              <div
                className={`toggle-container ${mode} ${
                  darkMode ? "dark-mode" : ""
                }`}
                onClick={toggleMode}
              >
                <div
                  className="option contextual-option"
                  onClick={() => setMode("contextual")}
                >
                  Contextual
                </div>
                <div className="slider">
                  <div className="dots"></div>
                </div>
                <div
                  className="option creative-option"
                  onClick={() => setMode("creative")}
                >
                  Creative
                </div>
              </div>
              <Tooltip
                title={
                  mode === "creative"
                    ? "Creative Mode: Provides more imaginative, inferred responses based on context and creativity."
                    : "Contextual Mode: Answers based on provided context, strictly sticking to the information given."
                }
                arrow
              >
                <InfoIcon
                  style={{
                    cursor: "pointer",
                    marginLeft: "4px",
                    fontSize: "18px",
                  }}
                />
              </Tooltip>
            </div>
          </MenuItem>

          <MenuItem
            component="a"
            href="https://carnotresearch.com/#section-about"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            About Us
          </MenuItem>

          {/* User Manual Button */}
          <MenuItem className="menu-item">
            <Button
              color="primary"
              startIcon={<MenuBookIcon />}
              onClick={handleManualOpen}
              style={{
                backgroundColor: "#FFFFFF",
                color: "#000000",
                textTransform: "none",
                fontSize: "16px",
                width: "100%",
              }}
            >
              Help
            </Button>
          </MenuItem>

          {isLoggedIn && (
            <MenuItem className="menu-item">
              <Link
                className="menu-item"
                to="/pricing"
                style={{ color: darkMode ? "white" : "black" }}
              >
                Pricing
              </Link>
            </MenuItem>
          )}

          {location.pathname === "/" && [
            <MenuItem
              key="input-grid-selector"
              className="menu-item input-grid-selector"
            >
              <LanguageGridSelector
                label="Input"
                selectedLanguage={
                  languages.find((lang) => lang.value === inputLanguage)
                    ?.label || "English"
                }
                languages={languages}
                onChange={setInputLanguage}
                darkMode={darkMode}
              />
            </MenuItem>,
            <MenuItem
              key="output-grid-selector"
              className="menu-item output-grid-selector"
            >
              <LanguageGridSelector
                label="Output"
                selectedLanguage={
                  languages.find((lang) => lang.value === outputLanguage)
                    ?.label || "English"
                }
                languages={languages}
                onChange={setOutputLanguage}
                darkMode={darkMode}
              />
            </MenuItem>,
          ]}

          <MenuItem className="menu-item">
            {isLoggedIn ? (
              <a
                className="btn login-logout-btn"
                onClick={handleLogout}
                style={{
                  color: darkMode ? "white" : "black",
                  cursor: "pointer",
                  marginLeft: "-0.5px",
                }}
              >
                Logout
              </a>
            ) : (
              <a
                className="btn login-logout-btn"
                onClick={handleLoginClick}
                style={{
                  color: darkMode ? "white" : "black",
                  cursor: "pointer",
                  marginLeft: "-0.5px",
                }}
              >
                Login
              </a>
            )}
          </MenuItem>

          <MenuItem className="menu-item">
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              style={{ color: darkMode ? "white" : "black" }}
            >
              {darkMode ? (
                <Brightness7Icon style={{ color: "white" }} />
              ) : (
                <DarkModeIcon style={{ color: "black" }} />
              )}
            </button>
          </MenuItem>
        </Menu>

        {/* User Manual Dialog */}
        <Dialog
          open={openManualDialog}
          onClose={handleManualClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            iCarKnow Chat User Manual
            <IconButton
              aria-label="close"
              onClick={handleManualClose}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <UserManual />
          </DialogContent>
        </Dialog>
      </nav>
    </>
  );
};

export default Navbar;
