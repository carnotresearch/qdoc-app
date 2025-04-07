import React, { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { usePageView } from "../PageViewContext";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const PdfViewer = React.memo(({ pdfUrl, filename }) => {
  const [numPages, setNumPages] = useState(null);
  const { pageToView, highlightPage, counter } = usePageView();
  const pageRefs = useRef({});
  const containerRef = useRef(null);

  // Debug logging for props and context
  useEffect(() => {
    console.log("[DEBUG] PdfViewer props:", { pdfUrl, filename });
    console.log("[DEBUG] PageView context:", { pageToView, highlightPage });
  }, [pdfUrl, filename, pageToView, highlightPage]);

  // Handle page navigation when pageToView changes
  useEffect(() => {
    if (pageToView && pageToView.pageNumber) {
      console.log("[DEBUG] Processing navigation request:", pageToView);
      
      // For testing: if we're using the test document or the filenames match
      const isMatchingFile = pageToView.filename === filename || 
                           (pageToView.filename === "document.pdf" && !filename) ||
                           true; // Force matching for testing
      
      if (isMatchingFile) {
        console.log(`[DEBUG] Navigating to page ${pageToView.pageNumber}`);
        
        // Scroll to the page with a longer delay to ensure the document is rendered
        setTimeout(() => {
          const pageElement = pageRefs.current[pageToView.pageNumber];
          console.log("[DEBUG] Page element:", pageElement);
          console.log("[DEBUG] Container element:", containerRef.current);
          
          if (pageElement && containerRef.current) {
            console.log("[DEBUG] Scrolling to page", pageToView.pageNumber);
            pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
            
            // Apply a temporary highlight effect with inline styles as well
            pageElement.style.border = "4px solid #4CAF50";
            pageElement.style.boxShadow = "0 0 15px rgba(76, 175, 80, 0.7)";
            
            setTimeout(() => {
              pageElement.style.border = "";
              pageElement.style.boxShadow = "";
            }, 2000);
          } else {
            console.error("[DEBUG] Could not find page element to scroll to");
          }
        }, 500); // Increased timeout for more reliable scrolling
      }
    }
  }, [pageToView, filename, counter]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    console.log("Document loaded, number of pages:", numPages);
    setNumPages(numPages);
  }, []);

  return (
    <div className="pdf-viewer" ref={containerRef}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => {
          const pageNumber = index + 1;
          // For testing: Allow highlighting with test document name or any file
          const isTestDoc = pageToView && (
            pageToView.filename === "document.pdf" || 
            pageToView.filename === filename ||
            true // Force match for testing
          );
          
          const shouldHighlight = highlightPage && pageToView && 
                                  isTestDoc && pageToView.pageNumber === pageNumber;
          
          return (
            <div 
              key={`page_${pageNumber}`} 
              ref={el => {
                pageRefs.current[pageNumber] = el;
                // Debug log when each page element is created/updated
                if (pageNumber === 2) {
                  console.log(`[DEBUG] Page ${pageNumber} element created:`, el);
                }
              }}
              className={`pdf-page ${shouldHighlight ? 'highlight-page' : ''}`}
              style={{ 
                margin: '10px 0', 
                padding: '5px',
                scrollMarginTop: '50px' // Add scroll margin to improve scrollIntoView behavior
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* Page number indicator for debugging */}
                <div style={{ 
                  position: 'absolute', 
                  top: '5px', 
                  right: '5px', 
                  background: 'rgba(0,0,0,0.5)', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '3px',
                  zIndex: 100
                }}>
                  Page {pageNumber}
                </div>
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                />
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
});

export default PdfViewer;