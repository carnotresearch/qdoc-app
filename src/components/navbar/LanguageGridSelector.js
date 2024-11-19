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

const LanguageGridSelector = ({
  label,
  selectedLanguage,
  onChange,
  darkMode,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
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
    onChange(languageValue);
    handleClosePopover();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenPopover}
        style={{
          margin: "0 8px",
          color: darkMode ? "white" : "black",
          borderColor: darkMode ? "white" : "black",
          textTransform: "none",
        }}
      >
        {label}: {selectedLanguage}
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
          },
        }}
      >
        <Grid container spacing={2}>
          {languages.map((language) => (
            <Grid item xs={6} sm={4} key={language.value}>
              <Button
                variant="contained"
                onClick={() => handleLanguageSelect(language.value)}
                style={{
                  width: "100%",
                  height: "60px",
                  textTransform: "none",
                  backgroundColor:
                    selectedLanguage === language.label
                      ? "#3f51b5"
                      : darkMode
                      ? "#757575"
                      : "#e0e0e0",
                  color:
                    selectedLanguage === language.label
                      ? "#fff"
                      : darkMode
                      ? "#fff"
                      : "#000",
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

export default LanguageGridSelector;
