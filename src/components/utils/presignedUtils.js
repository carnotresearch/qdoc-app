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
  } catch (err) {
    console.error("Error uploading files:", err);
    alert("Failed to upload files.");
    throw new Error("Error uploading files to S3");
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
  } catch (err) {
    console.error("Error uploading files:", err);
    alert("Failed to upload files.");
    throw new Error("Error uploading additional files.");
  }
};

export const fetchFileFromS3 = async (token, sessionId, fileName) => {
  try {
    // Call the API to get the presigned URL for the given file
    const {
      data: { presignedUrl, fileName: returnedFileName },
    } = await axios.post(`${process.env.REACT_APP_AWS_FETCH_PRESIGNED_URL}`, {
      token,
      sessionId,
      fileName,
    });

    // Fetch the file using the presigned URL
    const response = await fetch(presignedUrl);
    const blob = await response.blob();

    // Convert Blob to File object
    const file = new File([blob], returnedFileName, { type: blob.type });
    return file;
  } catch (err) {
    console.error("Error fetching file:", err);
    alert(
      "Your container is updated but we couldn't fetch your file. You can ask questions regarding your documents."
    );
  }
};
