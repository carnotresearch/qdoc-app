import React, { useContext, useState, useRef } from "react";
import { Form, Card } from "react-bootstrap";
import { RiMessage2Fill } from "react-icons/ri";
import { FileContext } from "../FileContext";
import axios from "axios";
import Popup from "./Popup";
import { FaFileAlt } from "react-icons/fa";

const RestrictedUpload = ({ isLandingPage }) => {
  const { setFiles } = useContext(FileContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const popupText =
    "You can create only one knowledge container. Please login for free, to create more.";

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    await handleFileChange(files);
  };

  const cardStyle = {
    border: "2px dashed #ccc",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    width: "10rem",
    height: isLandingPage ? "8rem" : "auto",
  };

  const handleFileChange = async (files) => {
    if (!isLandingPage) {
      setShowPopup(true);
      return;
    }

    if (files && files.length === 1) {
      setIsUploading(true);
      try {
        const fingerprint = sessionStorage.getItem("fingerprint");
        const filesArray = Array.from(files);
        
        // Sanitize filenames by replacing non-alphanumeric chars with underscores
        // This matches the sanitization done in Sidebar.js
        const sanitizedFiles = filesArray.map(file => {
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          return new File([file], sanitizedName, { type: file.type });
        });
        
        const formData = new FormData();
        sanitizedFiles.forEach((file) => formData.append("files", file));
        formData.append("fingerprint", fingerprint);

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/freeTrial`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        if (
          response.data.message &&
          response.data.message === "No data was extracted!"
        ) {
          alert("Kindly login to upload scanned documents");
          return;
        }
        
        // Store the sanitized files in context
        setFiles(sanitizedFiles);
        
        // Store the current filename in session storage for reference
        sessionStorage.setItem("currentFile", sanitizedFiles[0].name);
        
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        sessionStorage.setItem("trialUsed", "true");
        // Set 30-minute timeout for free trial
        const trialExpiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes
        sessionStorage.setItem("freeTrialExpiryTime", trialExpiryTime.toString());
        setIsUploading(false);
      }
    } else {
      setShowPopup(true);
    }
  };

  return (
    <>
      <Form>
        <Form.Group className="mb-3 mt-3">
          <div
            className="custom-file-input"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              id="file"
              accept=".txt,.pdf,.docx"
              onChange={(event) => handleFileChange(event.target.files)}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Card className="p-1" style={cardStyle}>
              {isUploading ? (
                <div className="text-center">
                  <video
                    src="/container.mp4"
                    loop
                    autoPlay
                    muted
                    style={{ width: "100%", height: "90%" }}
                  />
                  <p className="mb-0">This may take some time...</p>
                </div>
              ) : (
                <div>
                  <p className="mb-0 mt-1" style={{ fontSize: "0.8rem" }}>
                    Knowledge container
                  </p>
                  {isLandingPage && (
                    <FaFileAlt
                      style={{ fontSize: "2rem" }}
                      className="mt-2 mb-2"
                    />
                  )}
                  <p className="mb-0">
                    <RiMessage2Fill /> <b>Upload File</b>
                  </p>
                </div>
              )}
            </Card>
          </div>
        </Form.Group>
      </Form>

      <Popup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        popupText={popupText}
      />
    </>
  );
};

export default RestrictedUpload;