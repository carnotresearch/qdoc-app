import React, { useContext, useState, useRef } from "react";
import { Form, Card } from "react-bootstrap";
import { RiMessage2Fill } from "react-icons/ri";
import { FileContext } from "../FileContext";
import axios from "axios";
import Popup from "./Popup";

const RestrictedUpload = () => {
  const { setFiles } = useContext(FileContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const popupText = "Please login to upload files.";

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
    height: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "600px", // Doubled width
    margin: "0 auto", // Center horizontally
  };

  const marginStyle = { marginTop: "1.5cm" };

  const handleFileChange = async (files) => {
    const trialUsed = localStorage.getItem("trialUsed");
    if (trialUsed === "true") {
      setShowPopup(true);
      return;
    }

    if (files && files.length === 1) {
      setIsUploading(true);
      try {
        const fingerprint = localStorage.getItem("fingerprint");
        const filesArray = Array.from(files);
        const formData = new FormData();
        filesArray.forEach((file) => formData.append("files", file));
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
        setFiles(filesArray);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        localStorage.setItem("trialUsed", "true");
        setIsUploading(false);
      }
    } else {
      setShowPopup(true);
    }
  };

  return (
    <>
      <Form style={marginStyle}>
        <Form.Group className="mb-3">
          <div
            className="custom-file-input"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              id="file"
              accept=".txt,.pdf,.docx,.csv,.xlsx"
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
                    style={{ width: "100%", height: "auto" }}
                  />
                  <p className="mb-0">This may take some time...</p>
                </div>
              ) : (
                <div>
                  <p className="mb-0">
                    <RiMessage2Fill /> <b>New Container</b>
                  </p>
                  <p className="mb-0">Drop files here</p>
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
