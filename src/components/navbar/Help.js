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
    margin: "0 8px",
    textTransform: "none",
    fontSize: "16px",
    width: "100%",
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
