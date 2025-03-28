import React, { useState } from "react";
import {
  Button,
  Popover,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { languages } from "../../constant/data";

const UnifiedLanguageSelector = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  darkMode,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState("Input"); // To toggle between Input and Output
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleLanguageSelect = (languageValue) => {
    if (selectedType === "Input") {
      setInputLanguage(languageValue);
    } else {
      setOutputLanguage(languageValue);
    }
    handleClosePopover();
  };

  return (
    <>
      <Button
        onClick={handleOpenPopover}
        style={{
          color: darkMode ? "white" : "black",
          textTransform: "none",
        }}
      >
        <img
          src="language.png"
          alt="Language Icon"
          style={{ width: "35px", height: "25px" }}
        />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            backgroundColor: darkMode ? "#424242" : "#fff",
            color: darkMode ? "white" : "black",
            padding: "16px",
            maxWidth: isSmallScreen ? "90vw" : "400px",
            boxShadow: darkMode
              ? "0px 4px 20px rgba(0, 0, 0, 0.5)"
              : "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
          },
        }}
      >
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Button
            variant="text"
            onClick={() => setSelectedType("Input")}
            style={{
              color:
                selectedType === "Input"
                  ? "white"
                  : darkMode
                  ? "white"
                  : "black",
              backgroundColor: selectedType === "Input" ? "#3f51b5" : "",
              textTransform: "none",
              transition: "color 0.3s ease-in-out",
              marginRight: "1rem",
            }}
          >
            Input Language
          </Button>
          <Button
            variant="text"
            onClick={() => setSelectedType("Output")}
            style={{
              color:
                selectedType === "Output"
                  ? "white"
                  : darkMode
                  ? "white"
                  : "black",
              backgroundColor: selectedType === "Output" ? "#3f51b5" : "",
              textTransform: "none",
              transition: "color 0.3s ease-in-out",
              marginLeft: "1rem",
            }}
          >
            Output Language
          </Button>
        </div>
        <Grid container spacing={2} style={{ marginTop: "0" }}>
          {languages.map((language) => (
            <Grid item xs={6} sm={4} key={language.value}>
              <Button
                variant="contained"
                onClick={() => handleLanguageSelect(language.value)}
                style={{
                  width: "100%",
                  height: "50px",
                  textTransform: "none",
                  backgroundColor:
                    (selectedType === "Input" &&
                      inputLanguage === language.value) ||
                    (selectedType === "Output" &&
                      outputLanguage === language.value)
                      ? "#3f51b5"
                      : darkMode
                      ? "#757575"
                      : "#e0e0e0",
                  color:
                    (selectedType === "Input" &&
                      inputLanguage === language.value) ||
                    (selectedType === "Output" &&
                      outputLanguage === language.value)
                      ? "#fff"
                      : darkMode
                      ? "#fff"
                      : "#000",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                }}
              >
                <Typography variant="body1">{language.label}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </>
  );
};

export default UnifiedLanguageSelector;
