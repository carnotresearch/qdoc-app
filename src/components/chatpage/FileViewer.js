import React, { useEffect, useState, useRef } from "react";
import PdfViewer from "../PdfViewer";
import { renderAsync } from "docx-preview";
import "../../styles/fileViewer.css";

function FileViewer({ files }) {
  const [fileContents, setFileContents] = useState([]);
  const docxRefs = useRef([]);

  useEffect(() => {
    const loadFiles = async () => {
      const contents = await Promise.all(
        files.map(async (file) => {
          if (file.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            return { name: file.name, content: url, type: "pdf" };
          } else if (file.type === "text/plain") {
            const text = await readTextFile(file);
            return { name: file.name, content: text, type: "text" };
          } else if (
            file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/msword"
          ) {
            const arrayBuffer = await readDocxFileAsArrayBuffer(file);
            return { name: file.name, content: arrayBuffer, type: "docx" };
          }
          return null;
        })
      );
      setFileContents(contents.filter((content) => content !== null));
    };

    if (files.length > 0) {
      loadFiles();
    }
  }, [files]);

  const readTextFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const readDocxFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    fileContents.forEach((file, index) => {
      if (file.type === "docx") {
        renderAsync(file.content, docxRefs.current[index], undefined, {
          inWrapper: true, // Ensure the content is wrapped correctly
        }).then(() => {
          const docPage = docxRefs.current[index];
          if (docPage) {
            docPage.style.maxWidth = "100%";
            docPage.style.overflowX = "auto";
          }
        });
      }
    });
  }, [fileContents]);

  if (files.length === 0) {
    return null; // Return null to render nothing if no files are uploaded
  }

  return (
    <div className="file-viewer">
      {fileContents.map((file, index) => (
        <div key={index} className="file-page" style={{ color: "black" }}>
          <h4>{file.name}</h4>
          {file.type === "pdf" ? (
            <PdfViewer pdfUrl={file.content} />
          ) : file.type === "docx" ? (
            <div
              className="doc-page"
              ref={(el) => (docxRefs.current[index] = el)}
            />
          ) : (
            <div className="doc-page">
              <div>{file.content}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FileViewer;
