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
import InputLanguage from "./navbar/InputLanguage";
import OutputLanguage from "./navbar/OutputLanguage";

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

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        {/* User Profile */}
        <Profile />

        {/* Heading */}
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

            {/* Items displayed only on chat page */}
            {location.pathname === "/" && [
              // Pricing Link
              <Link className="nav-link" to="/pricing" key={1}>
                Pricing
              </Link>,
              // User Manual Button
              <Help setOpenManualDialog={setOpenManualDialog} key={2} />,
              // Mode Toggle
              <li className="nav-item" style={{ marginLeft: "0.5rem" }} key={3}>
                <ContextMode mode={mode} setMode={setMode} />
              </li>,
              // Input Language Button
              <InputLanguage
                inputLanguage={inputLanguage}
                setInputLanguage={setInputLanguage}
                darkMode={darkMode}
                key={4}
              />,
              // Output Language Button
              <OutputLanguage
                outputLanguage={outputLanguage}
                setOutputLanguage={setOutputLanguage}
                darkMode={darkMode}
                key={5}
              />,
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
            // User Manual Button
            <MenuItem className="menu-item" key="user-manual">
              <Help setOpenManualDialog={setOpenManualDialog} />
            </MenuItem>,
            // Input Language Button
            <MenuItem
              key="input-grid-selector"
              className="menu-item input-grid-selector"
            >
              <InputLanguage
                inputLanguage={inputLanguage}
                setInputLanguage={setInputLanguage}
                darkMode={darkMode}
              />
            </MenuItem>,
            // Output Language button
            <MenuItem
              key="output-grid-selector"
              className="menu-item output-grid-selector"
            >
              <OutputLanguage
                outputLanguage={outputLanguage}
                setOutputLanguage={setOutputLanguage}
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
