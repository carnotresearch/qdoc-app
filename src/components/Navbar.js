import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Import Book Icon
import "../styles/navbar.css";
import PaymentForm from "./PaymentForm";
import UserManual from "./UserManual"; // Import User Manual component

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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [openManualDialog, setOpenManualDialog] = useState(false); // State for User Manual dialog
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // State for the temperature slider, loaded from sessionStorage if available
  const [temperature, setTemperature] = useState(
    sessionStorage.getItem("temperature") || 0.2
  );
  const [mode, setMode] = useState(
    sessionStorage.getItem("answerMode") === "2" ? "creative" : "contextual"
  ); // Map session storage value to mode
  const [dropdownOpen, setDropdownOpen] = useState(false); // For settings dropdown

  // Save temperature to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("temperature", temperature);
  }, [temperature]);

  // Save mode to sessionStorage when it changes
  useEffect(() => {
    if (mode === "contextual") {
      sessionStorage.setItem("answerMode", "1"); // Set to 1 for Contextual Mode
    } else if (mode === "creative") {
      sessionStorage.setItem("answerMode", "2"); // Set to 2 for Creative Mode
    }
  }, [mode]);

  // Close menu when screen size changes
  useEffect(() => {
    if (isLargeScreen) {
      handleCloseMenu();
    }
  }, [isLargeScreen]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    sessionStorage.removeItem("answerMode"); // Clear mode on logout
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

  const handleUpgradeClick = () => {
    setOpenUpgradeDialog(true);
  };

  const handleCloseUpgradeDialog = () => {
    setOpenUpgradeDialog(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

        {/* User Manual Button */}
        <div className="mx-auto">
          <Button
            variant="contained"
            color="primary"
            startIcon={<MenuBookIcon />}
            onClick={handleManualOpen}
            style={{ backgroundColor: "#000080", color: "#fff", marginLeft: "12cm", marginRight: "12cm" }}
          >
            Helpfile
          </Button>
        </div>

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
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">
                Pricing
              </Link>
            </li>
            {location.pathname === "/" && (
              <>
                <LanguageDropdown
                  className="className1"
                  label="Input"
                  selectedLanguage={
                    languages.find((lang) => lang.value === inputLanguage)
                      ?.label || "English"
                  }
                  languages={languages}
                  onChange={setInputLanguage}
                />
                <LanguageDropdown
                  className="language-dropdown-output"
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
                <button
                  className="btn btn-purple"
                  style={{
                    color: darkMode ? "white" : "black",
                    fontFamily: "Roboto",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                  onClick={handleUpgradeClick}
                >
                  Upgrade
                </button>
              </li>
            )}

            {/* Settings Dropdown */}
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
          <MenuItem
            component="a"
            href="https://carnotresearch.com/#section-about"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            About Us
          </MenuItem>
          <MenuItem className="menu-item">
            <Link
              className="menu-item"
              to="/pricing"
              style={{ color: darkMode ? "white" : "black" }}
            >
              Pricing
            </Link>
          </MenuItem>

          {location.pathname === "/" && [
            <MenuItem key="input-dropdown" className="menu-item input-dropdown">
              <LanguageDropdown
                label="Input"
                selectedLanguage={
                  languages.find((lang) => lang.value === inputLanguage)?.label ||
                  "English"
                }
                languages={languages}
                onChange={setInputLanguage}
              />
            </MenuItem>,
            <MenuItem key="output-dropdown" className="menu-item output-dropdown">
              <LanguageDropdown
                label="Output"
                selectedLanguage={
                  languages.find((lang) => lang.value === outputLanguage)
                    ?.label || "English"
                }
                languages={languages}
                onChange={setOutputLanguage}
              />
            </MenuItem>,
          ]}

          {paid === "0" && (
            <MenuItem className="menu-item">
              <button
                className="btn btn-purple"
                style={{
                  color: darkMode ? "white" : "black",
                  fontFamily: "Roboto",
                  textTransform: "none",
                  fontSize: "16px",
                }}
                onClick={handleUpgradeClick}
              >
                Upgrade
              </button>
            </MenuItem>
          )}

          {/* Settings in Mobile Menu */}
          <MenuItem className="menu-item">
            <button className="btn" onClick={toggleDropdown}>
              <SettingsIcon />
            </button>
          </MenuItem>

          {dropdownOpen && (
            <div
              className="dropdown-menu show"
              style={{
                position: "relative",
                backgroundColor: darkMode ? "#424242" : "#f5f5f5",
                padding: "10px",
                zIndex: 1400, // Ensure it appears above other elements
              }}
            >
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

          <MenuItem className="menu-item">
            {location.pathname === "/" ? (
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

        {/* Upgrade Dialog */}
        <Dialog open={openUpgradeDialog} onClose={handleCloseUpgradeDialog}>
          <IconButton
            onClick={handleCloseUpgradeDialog}
            style={{
              position: "absolute",
              right: "6px",
              top: "6px",
            }}
          >
            <CloseIcon />
          </IconButton>

          <PaymentForm />

          <DialogActions></DialogActions>
        </Dialog>

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
