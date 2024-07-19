import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import PdfViewer from "./PdfViewer";
import "../styles/fileViewer.css";

function FileViewer({ files }) {
  const [fileContents, setFileContents] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const contents = await Promise.all(
        files.map(async (file) => {
          if (file.type === "application/pdf") {
            // For PDFs, we only create a URL
            const url = URL.createObjectURL(file);
            return { name: file.name, content: url, type: "pdf" };
          } else if (file.type === "text/plain") {
            const text = await readTextFile(file);
            return { name: file.name, content: text, type: "text" };
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const html = await readDocxFile(file);
            return { name: file.name, content: html, type: "docx" };
          }
          return null;
        })
      );
      setFileContents(contents.filter(content => content !== null));
    };

    loadFiles();
  }, [files]);

  const readTextFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const readDocxFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="file-viewer">
      {fileContents.map((file, index) => (
        <div key={index} className="file-page">
          <h4>{file.name}</h4>
          {file.type === "pdf" ? (
            <PdfViewer pdfUrl={file.content} />
          ) : (
            <div className="doc-page">
              <div dangerouslySetInnerHTML={{ __html: file.content }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FileViewer;