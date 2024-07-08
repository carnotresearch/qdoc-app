import React, { useEffect, useState } from "react";
// import { Buffer } from "buffer";
import mammoth from "mammoth";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../styles/fileViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

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
        resolve({ name: file.name, content: arrayBuffer, type: file.type });
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
            <>Hello</>
          ) : (
            // <PdfViewer pdfData={file.content} />
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

// function PdfViewer({ pdfData }) {
//   const [numPages, setNumPages] = useState(null);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className="pdf-viewer">
//       <Document file={{ data: pdfData }} onLoadSuccess={onDocumentLoadSuccess}>
//         {Array.from(new Array(numPages), (el, index) => (
//           <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//         ))}
//       </Document>
//     </div>
//   );
// }

export default FileViewer;
