import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import PdfViewer from "./PdfViewer";
import "../styles/fileViewer.css";

function FileViewer({ files }) {
  const [fileContents, setFileContents] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const txtFiles = files.filter((file) => file.type === "text/plain");
      const docxFiles = files.filter(
        (file) =>
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      const pdfFiles = files.filter((file) => file.type === "application/pdf");

      const txtContents = await Promise.all(
        txtFiles.map((file) => readFile(file, "text"))
      );
      const docxContents = await Promise.all(
        docxFiles.map((file) => readDocxFile(file))
      );
      const pdfContents = await Promise.all(
        pdfFiles.map((file) => readPdfFile(file))
      );

      setFileContents([...txtContents, ...docxContents, ...pdfContents]);
    };

    loadFiles();
  }, [files]);

  const readFile = (file, fileType) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        if (fileType === "text") {
          resolve({ name: file.name, content: [content], type: file.type });
        }
      };

      reader.onerror = reject;
      if (fileType === "text") {
        reader.readAsText(file);
      }
    });
  };

  const readDocxFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const htmlContent = result.value;
          resolve({ name: file.name, content: [htmlContent], type: file.type });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readPdfFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        resolve({ name: file.name, content: url, type: file.type });
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="file-viewer">
      {fileContents.map((file, index) => (
        <div key={index} className="file-page">
          <h4>{file.name}</h4>
          {file.type === "application/pdf" ? (
            <PdfViewer pdfUrl={file.content} />
          ) : (
            file.content.map((page, pageIndex) => (
              <div key={pageIndex} className="doc-page">
                <div dangerouslySetInnerHTML={{ __html: page }} />
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default FileViewer;
