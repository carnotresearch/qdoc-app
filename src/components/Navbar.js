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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Profile from "./navbar/Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import UserManual from "./navbar/UserManual";
import "../styles/navbar.css";
import ContextMode from "./navbar/ContextMode";
import Help from "./navbar/Help";
import UnifiedLanguageSelector from "./navbar/UnifiedLanguageSelector";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  darkMode,
  setDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  isFileUpdated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [mode, setMode] = useState("contextual");

  // creative mode selection
  useEffect(() => {
    if (mode === "contextual") {
      sessionStorage.setItem("answerMode", "1");
    } else if (mode === "creative") {
      sessionStorage.setItem("answerMode", "2");
    }
  }, [mode]);

  // hide menu on large screen
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

  const handleManualClose = () => {
    setOpenManualDialog(false);
  };

  const iconStyles = { height: "2.5rem", cursor: "pointer", margin: "0" };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        {isLoggedIn ? (
          <Profile />
        ) : (
          <a
            href="https://www.carnotresearch.com"
            target="_blank"
            rel="noopener noreferrer"
            style={iconStyles}
          >
            <img src="./logo.png" alt="" style={{ height: "2.5rem" }} />
          </a>
        )}
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
        {/* Right side items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
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

            {location.pathname === "/" &&
  isLoggedIn && [
    <Link className="nav-link" to="/pricing" key={1}>
      Pricing
    </Link>,
    <Help setOpenManualDialog={setOpenManualDialog} key={2} />,
    <li className="nav-item" style={{ marginLeft: "0.5rem" }} key={3}>
      <ContextMode mode={mode} setMode={setMode} />
    </li>,
    <li key={4}>
      <UnifiedLanguageSelector
        inputLanguage={inputLanguage}
        setInputLanguage={setInputLanguage}
        outputLanguage={outputLanguage}
        setOutputLanguage={setOutputLanguage}
        darkMode={darkMode}
      />
    </li>,
  ]}


            {/* Login Logout Button */}
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

        {isFileUpdated && !isLoggedIn ? (
          <UnifiedLanguageSelector
            inputLanguage={inputLanguage}
            setInputLanguage={setInputLanguage}
            outputLanguage={outputLanguage}
            setOutputLanguage={setOutputLanguage}
            darkMode={darkMode}
          />
        ) : (
          <div>
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
                style={{
                  fontSize: "2rem",
                  color: darkMode ? "white" : "black",
                }}
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
                <ContextMode mode={mode} setMode={setMode} />
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

              {location.pathname === "/" && [
                // Pricing Link
                <MenuItem className="menu-item" key="pricing">
                  <Link
                    className="menu-item"
                    to="/pricing"
                    style={{ color: darkMode ? "white" : "black" }}
                  >
                    Pricing
                  </Link>
                </MenuItem>,
                // Language Button
                <MenuItem key="language-selector">
                  <UnifiedLanguageSelector
                    inputLanguage={inputLanguage}
                    setInputLanguage={setInputLanguage}
                    outputLanguage={outputLanguage}
                    setOutputLanguage={setOutputLanguage}
                    darkMode={darkMode}
                  />
                </MenuItem>,
                // User Manual Button
                <MenuItem className="menu-item" key="user-manual">
                  <Help setOpenManualDialog={setOpenManualDialog} />
                </MenuItem>,
              ]}

              <MenuItem className="menu-item">
                {isLoggedIn ? (
                  <button
                    className="btn login-logout-btn"
                    onClick={handleLogout}
                    style={{
                      color: darkMode ? "white" : "black",
                      cursor: "pointer",
                      marginLeft: "-0.5px",
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn login-logout-btn"
                    onClick={handleLoginClick}
                    style={{
                      color: darkMode ? "white" : "black",
                      cursor: "pointer",
                      marginLeft: "-0.5px",
                    }}
                  >
                    Login
                  </button>
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
          </div>
        )}

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
