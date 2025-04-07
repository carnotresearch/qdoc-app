import React, { useEffect, useState, useRef } from "react";
import PdfViewer from "./PdfViewer";
import { renderAsync } from "docx-preview";
import * as XLSX from "xlsx";
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
          } else if (
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel" ||
            file.type === "text/csv"
          ) {
            const tableData = await readExcelOrCSVFile(file);
            return { name: file.name, content: tableData, type: "spreadsheet" };
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

  const readExcelOrCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Extract the first sheet's data and convert it to JSON
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Always limit to the first 50 rows
        jsonData = jsonData.slice(0, 50); // Limit to the first 50 rows

        resolve(jsonData); // Resolve the parsed data (array of arrays)
      };
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
            <>
              <div style={{ marginBottom: '10px' }}>
                <small style={{ backgroundColor: '#f8f9fa', padding: '3px 6px', borderRadius: '3px' }}>
                  Currently viewing: {file.name}
                </small>
              </div>
              <PdfViewer pdfUrl={file.content} filename={file.name} />
            </>
          ) : file.type === "docx" ? (
            <div
              className="doc-page"
              ref={(el) => (docxRefs.current[index] = el)}
            />
          ) : file.type === "text" ? (
            <div className="doc-page">
              <div>{file.content}</div>
            </div>
          ) : file.type === "spreadsheet" ? (
            <div className="spreadsheet-viewer">
              <p className="preview-message">
                This is a preview of the file displaying the first 50 rows.
              </p>
              <table border="1">
                <tbody>
                  {file.content.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default FileViewer;
