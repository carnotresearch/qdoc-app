import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    const files = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        files.push({
          filename: file.name,
          content: base64String,
        });
        if (files.length === selectedFiles.length) {
          uploadToServer(files);
        }
      };
    }
  };

  const uploadToServer = async (files) => {
    try {
      const response = await axios.post(
        "https://qi7j5xnae2.execute-api.ap-south-1.amazonaws.com/default/upload",
        {
          files: files,
        }
      );
      alert("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Files uploaded successfully");
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files</button>
    </div>
  );
};

export default FileUpload;
