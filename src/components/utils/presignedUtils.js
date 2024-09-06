import axios from "axios";

export const uploadMultiFiles = async (token, files) => {
  if (files.length === 0) {
    alert("Please select at least one file.");
    return;
  }

  try {
    // Prepare file data
    const fileData = Array.from(files).map((file) => ({
      fileName: file.name,
      fileType: file.type,
    }));

    // Request presigned URLs from Lambda for all files
    const {
      data: { presignedUrls, sessionId },
    } = await axios.post(`${process.env.REACT_APP_UPLOAD_PRESIGNED}`, {
      token,
      files: fileData,
    });

    console.log("presigned urls: ", presignedUrls);
    sessionStorage.setItem("sessionId", sessionId);

    // Upload each file to its respective presigned URL
    await Promise.all(
      presignedUrls.map(async (urlData, index) => {
        const file = files[index];
        console.log("uploading file: ", file);
        await axios.put(urlData.uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      })
    );

    alert("All files uploaded successfully!");
  } catch (err) {
    console.error("Error uploading files:", err);
    alert("Failed to upload files.");
  }
};

export const addUploadFiles = async (token, sessionId, files) => {
  if (files.length === 0) {
    alert("Please select at least one file.");
    return;
  }

  try {
    // Prepare file data
    const fileData = Array.from(files).map((file) => ({
      fileName: file.name,
      fileType: file.type,
    }));

    // Request presigned URLs from Lambda for all files
    const {
      data: { presignedUrls },
    } = await axios.post(`${process.env.REACT_APP_ADD_UPLOAD_PRESIGNED}`, {
      token,
      sessionId,
      files: fileData,
    });

    console.log("presigned urls: ", presignedUrls);

    // Upload each file to its respective presigned URL
    await Promise.all(
      presignedUrls.map(async (urlData, index) => {
        const file = files[index];
        console.log("uploading file: ", file);
        await axios.put(urlData.uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      })
    );

    alert("All files uploaded successfully!");
  } catch (err) {
    console.error("Error uploading files:", err);
    alert("Failed to upload files.");
  }
};
