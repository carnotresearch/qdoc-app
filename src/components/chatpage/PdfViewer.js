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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Debug logging for props and context
  useEffect(() => {
    console.log("[DEBUG] PdfViewer props:", { pdfUrl, filename });
    console.log("[DEBUG] PageView context:", { pageToView, highlightPage });
  }, [pdfUrl, filename, pageToView, highlightPage]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(`[DEBUG] Document loaded with ${numPages} pages`);
    setNumPages(numPages);
    
    // If there's a pageToView, scroll to it after a slight delay
    if (pageToView && pageToView.filename === filename) {
      setTimeout(() => {
        scrollToPage(pageToView.pageNumber);
      }, 300);
    }
  };
  
  const scrollToPage = useCallback((pageNumber) => {
    console.log(`[DEBUG] Attempting to scroll to page ${pageNumber}`);
    const pageElement = pageRefs.current[pageNumber];
    
    if (pageElement) {
      console.log(`[DEBUG] Found element for page ${pageNumber}, scrolling...`);
      pageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    } else {
      console.log(`[DEBUG] No element found for page ${pageNumber}`);
    }
  }, []);

  // Watch for changes to pageToView and scroll when needed
  useEffect(() => {
    if (pageToView && pageToView.filename === filename && numPages > 0) {
      console.log(`[DEBUG] Page to view changed: ${pageToView.pageNumber} in ${filename}`);
      scrollToPage(pageToView.pageNumber);
    }
  }, [pageToView, filename, numPages, scrollToPage, counter]);

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
                scrollMarginTop: '50px', // Add scroll margin to improve scrollIntoView behavior
                width: '100%'
              }}
            >
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                  width={isMobile ? window.innerWidth - 40 : undefined} // Set fixed width on mobile
                  scale={isMobile ? 1.0 : undefined} // Adjust scale to fit
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