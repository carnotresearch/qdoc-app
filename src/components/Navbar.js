import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    navigate("/login");
  };
  

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
    <nav className={`navbar ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <Profile />
      <Link
        className="navbar-brand"
        style={{ marginLeft: "0.5cm" }}
        to="/"
      >
        iCarKno-chat
      </Link>
      <Button
        className="navbar-toggler"
        onClick={handleMenuClick}
        style={{
          border: `2px solid ${darkMode ? 'white' : 'black'}`,
          borderRadius: '6px',
          padding: '2px',
          color: darkMode ? 'white' : 'black',
        }}
      >
        <ArrowDropDownIcon style={{ fontSize: '2rem', color: darkMode ? 'white' : 'black' }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            width: '200px',
            backgroundColor: darkMode ? '#424242' : '#f5f5f5',
            color: darkMode ? 'white' : 'black',
            zIndex: 1300,
          },
        }}
        MenuListProps={{
          style: {
            padding: '10px',
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
        {location.pathname === "/" && (
          <>
          <MenuItem className="menu-item input-dropdown">
            <LanguageDropdown
              label="Input"
              selectedLanguage={
                languages.find((lang) => lang.value === inputLanguage)?.label || "English"
              }
              languages={languages}
              onChange={setInputLanguage}
            />
          </MenuItem>
          <MenuItem className="menu-item output-dropdown">
            <LanguageDropdown
              label="Output"
              selectedLanguage={
                languages.find((lang) => lang.value === outputLanguage)?.label || "English"
              }
              languages={languages}
              onChange={setOutputLanguage}
            />
          </MenuItem>
        </>
        
        )}
        {paid === "0" && (
          <MenuItem className="menu-item">
            <Link to="/payment" style={{ textDecoration: 'none' }}>
              <a className="btn btn-purple" style={{ border: '2px solid black', color: darkMode ? 'white' : 'black' }}>
                Upgrade
              </a>
            </Link>
          </MenuItem>
        )}
       <MenuItem className="menu-item">
  {location.pathname === "/" ?  (
    <a 
      className="btn login-logout-btn" 
      onClick={handleLogout} 
      style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer' }} 
    >
      Logout
    </a>
  ) : (
    <a 
      className="btn login-logout-btn" 
      onClick={handleLoginClick} 
      style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer' }} 
    >
      Login
    </a>
  )}
</MenuItem>

        <MenuItem className="menu-item">
          <a
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer' }} 
          >
            {darkMode ? <Brightness7Icon style={{ color: 'white' }} /> : <DarkModeIcon style={{ color: 'black' }} />}
          </a>
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default Navbar;
