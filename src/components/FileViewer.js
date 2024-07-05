import React, { useEffect, useState } from "react";
import "../styles/fileViewer.css";

function FileViewer({ files }) {
  console.log(files);
  const [fileContents, setFileContents] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const txtFiles = files.filter((file) => file.type === "text/plain");
      const contents = await Promise.all(
        txtFiles.map((file) => readFile(file))
      );
      setFileContents(contents);
    };

    loadFiles();
  }, [files]);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        resolve({ name: file.name, content, type: file.type });
      };

      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <div className="file-viewer">
      {fileContents.map((file, index) => (
        <div key={index} className="file-page">
          <h4>{file.name}</h4>
          <p>{file.content}</p>
        </div>
      ))}
    </div>
  );
}

export default FileViewer;
