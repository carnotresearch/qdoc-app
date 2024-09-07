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
    sessionStorage.setItem("sessionId", sessionId);

    // Upload each file to its respective presigned URL
    await Promise.all(
      presignedUrls.map(async (urlData, index) => {
        const file = files[index];
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

    // Upload each file to its respective presigned URL
    await Promise.all(
      presignedUrls.map(async (urlData, index) => {
        const file = files[index];
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

export const fetchFilesFromS3 = async (token, sessionId) => {
  try {
    // Call the API to get the presigned URLs for all files
    const {
      data: { presignedUrls },
    } = await axios.post(
      "https://9l5923hww6.execute-api.ap-south-1.amazonaws.com/default/fetchPresignedUrl",
      { token, sessionId }
    );

    // Fetch each file using its presigned URL
    const filePromises = presignedUrls.map(async (file) => {
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();

      // Convert Blob to File object
      return new File([blob], file.fileName, { type: blob.type });
    });

    // Wait for all files to be fetched
    const fetchedFiles = await Promise.all(filePromises);
    return fetchedFiles;
  } catch (err) {
    console.error("Error fetching files:", err);
    alert(
      "Your container is updated but we couln't fetch your files. You can ask questions regarding your documents."
    );
  }
};
