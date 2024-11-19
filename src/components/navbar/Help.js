import React from "react";
import { Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Help = ({ setOpenManualDialog }) => {
  const handleManualOpen = () => {
    setOpenManualDialog(true);
  };

  const buttonStyle = {
    backgroundColor: "white",
    color: "black",
    textTransform: "none",
    fontSize: "1rem",
  };

  return (
    <Button
      startIcon={<MenuBookIcon />}
      onClick={handleManualOpen}
      style={buttonStyle}
    >
      Help
    </Button>
  );
};

export default Help;
