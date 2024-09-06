
import React, { useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconButton } from '@mui/material';

import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../styles/navbar.css";
import { useMediaQuery, useTheme } from '@mui/material';
import Dialog from "@mui/material/Dialog"; 
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions"; 
import PaymentForm from "./PaymentForm";
import CloseIcon from '@mui/icons-material/Close';

import Pricing from "./Pricing";  


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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openUpgradeDialog, setOpenUpgradeDialog] = React.useState(false);
  const theme = useTheme(); 
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("paymentStatus");
    navigate("/login");
  };
   
  const handleClose = () => {
    setAnchorEl(null);
  };

 const handleLoginClick = () => {
  console.log("login");
  handleClose();
  
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
  useEffect(() => { 
    if (isLargeScreen) {
        handleCloseMenu(); 
    }
}, [isLargeScreen]); 

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <Profile />
      <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
        icarKno-chat
      </Link>
      <div className="collapse navbar-collapse " id="navbarNav" >
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
            <li className="nav-item"></li>
            <LanguageDropdown
           className="className1" 

            label="Input"
           selectedLanguage={
           languages.find((lang) => lang.value === inputLanguage)?.label || "English"
         }
        languages={languages}
          onChange={setInputLanguage}
        />
       <LanguageDropdown
        className="language-dropdown-output" 
 
          label="Output"
         selectedLanguage={
             languages.find((lang) => lang.value === outputLanguage)?.label || "English"
            }
           languages={languages}
           onChange={setOutputLanguage}
         />
            </>
          )}
           <div>
      {location.pathname === "/" && paid === "0" && (
        <li className="nav-item">
          <a
          
  className="btn btn-purple"
  style={{
    color: 'black',
    fontFamily: 'Roboto', 
    textTransform: 'none', 
    fontSize:'16px',
   color: darkMode ? 'white' : 'black'
    
    
  }}
            onClick={handleUpgradeClick}
>
       Upgrade
      </a>

        </li>
      )}

      {/* Upgrade Dialog */}
      <Dialog open={openUpgradeDialog} onClose={handleCloseUpgradeDialog}>
    
      <IconButton
        onClick={handleCloseUpgradeDialog}
        style={{
          position: 'absolute',
          right: '6px',  
          top: '6px',    
        }}
      >
        <CloseIcon />
      </IconButton>
      
    
      <PaymentForm />
      
      <DialogActions>
     
      </DialogActions>
    </Dialog>

    </div>
          
          <li className="nav-item">
            {location.pathname === "/" ? (
              <button className="btn login-logout-btn" style={{  cursor: 'pointer',marginLeft: '-1px' }}  onClick={handleLogout}>
                
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
      <Button
        className="navbar-toggler d-lg-none"
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
        <MenuItem className="menu-item">
            <Link className="menu-item" to="/pricing"
            style={{  color: darkMode ? 'white' : 'black' }}>
              Pricing
            </Link>
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
    <button
      className="btn btn-purple"
      style={{
        color: darkMode ? 'white' : 'black',
        fontFamily: 'Roboto',
        textTransform: 'none',
        fontSize: '16px',
      }}
      onClick={handleUpgradeClick}
    >
      Upgrade
    </button>
  </MenuItem>
)}


<Dialog open={openUpgradeDialog} onClose={handleCloseUpgradeDialog}>
  <IconButton
    onClick={handleCloseUpgradeDialog}
    style={{
      position: 'absolute',
      right: '8px',
      top: '8px',
    }}
  >
    <CloseIcon />
  </IconButton>

  <PaymentForm />

  <DialogActions>
    {/* Additional actions can be added here if needed */}
  </DialogActions>
</Dialog>
        <MenuItem className="menu-item">
          {location.pathname === "/" ?  (
            <a 
              className="btn login-logout-btn" 
              onClick={handleLogout} 
              style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer',marginLeft: '-0.5px' }} 
            >
              Logout
            </a>
          ) : (
            <a 
              className="btn login-logout-btn" 
              onClick={handleLoginClick} 
              style={{ 
                color: darkMode ? 'white' : 'black', 
                cursor: 'pointer', 
                marginLeft: '-0.5px' 
              }}
              onClose={handleClose}
            >
              Login
            </a>
          )}
        </MenuItem>
        <MenuItem className="menu-item">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            style={{ color: darkMode ? 'white' : 'black' }}
          >
            {darkMode ? <Brightness7Icon style={{ color: 'white' }} /> : <DarkModeIcon style={{ color: 'black' }} />}
          </button>
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default Navbar;