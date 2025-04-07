import React, { useState, useCallback, useEffect, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { SourceContext } from "../../components/SourceContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Use the correct worker source
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

// Custom CSS for highlighting
const highlightStyle = `
.highlight-overlay {
  position: absolute;
  background-color: rgba(255, 255, 0, 0.3);
  pointer-events: none;
  z-index: 10;
  border-radius: 2px;
}
`;

const PdfViewer = React.memo(({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const { activeSource } = useContext(SourceContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [renderedOverlays, setRenderedOverlays] = useState({});

  // Create a highlight overlay using DOM elements
  const createHighlightOverlay = useCallback(async (pageNumber, textSnippet, pageObj) => {
    // Remove any existing highlights
    const existingHighlights = document.querySelectorAll('.highlight-overlay');
    existingHighlights.forEach(el => el.remove());
    
    // Check if we have already created an overlay for this page and snippet
    const overlayKey = `${pageNumber}-${textSnippet}`;
    if (renderedOverlays[overlayKey]) {
      console.log("Using cached overlay position");
      addHighlightOverlay(pageNumber, renderedOverlays[overlayKey]);
      return;
    }
    
    try {
      // Get the page element
      const pageElement = document.getElementById(`page_${pageNumber}`);
      if (!pageElement) return;
      
      // Get page dimensions
      const pageCanvas = pageElement.querySelector('canvas');
      if (!pageCanvas) return;
      
      // Create a highlight overlay
      const highlight = document.createElement('div');
      highlight.className = 'highlight-overlay';
      
      // For simplicity, create a highlight in the middle of the page
      // In a real implementation, you would use PDF.js to get text positions
      const width = pageCanvas.width * 0.6;
      const height = 30;
      const left = pageCanvas.width * 0.2;
      const top = pageCanvas.height * 0.3;
      
      highlight.style.width = `${width}px`;
      highlight.style.height = `${height}px`;
      highlight.style.left = `${left}px`;
      highlight.style.top = `${top}px`;
      
      pageElement.appendChild(highlight);
      
      // Cache the position
      setRenderedOverlays(prev => ({
        ...prev,
        [overlayKey]: { width, height, left, top }
      }));
      
      // Scroll to the highlight
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error("Error creating highlight overlay:", error);
    }
  }, [renderedOverlays, addHighlightOverlay]);
  
  // Add a highlight overlay using cached positions
  const addHighlightOverlay = useCallback((pageNumber, position) => {
    const pageElement = document.getElementById(`page_${pageNumber}`);
    if (!pageElement) return;
    
    const highlight = document.createElement('div');
    highlight.className = 'highlight-overlay';
    
    highlight.style.width = `${position.width}px`;
    highlight.style.height = `${position.height}px`;
    highlight.style.left = `${position.left}px`;
    highlight.style.top = `${position.top}px`;
    
    pageElement.appendChild(highlight);
    
    // Scroll to the highlight
    highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages, pdfInfo }) => {
    console.log("Document loaded, number of pages:", numPages);
    setNumPages(numPages);
    setPdfDocument(pdfInfo._pdfInfo.fingerprint);
  }, []);

  // Function to handle page render success
  const onPageRenderSuccess = useCallback((pageNumber, page) => {
    console.log(`Page ${pageNumber} rendered successfully`);
    
    // If this is the active page and we have an active source, try to create a highlight
    if (pageNumber === currentPage && activeSource && activeSource.pageNo === pageNumber) {
      createHighlightOverlay(pageNumber, activeSource.textSnippet, page);
    }
  }, [currentPage, activeSource, createHighlightOverlay]);

  // Effect to handle activeSource changes
  useEffect(() => {
    if (activeSource && activeSource.pageNo) {
      setCurrentPage(activeSource.pageNo);
      
      // Wait for the page to render
      setTimeout(() => {
        const pageElement = document.getElementById(`page_${activeSource.pageNo}`);
        if (pageElement) {
          // Try to create a highlight overlay
          const pageObj = pageElement.querySelector('canvas');
          if (pageObj) {
            createHighlightOverlay(activeSource.pageNo, activeSource.textSnippet, pageObj);
          }
        }
      }, 500);
    } else {
      // Clear highlights when no active source
      const existingHighlights = document.querySelectorAll('.highlight-overlay');
      existingHighlights.forEach(el => el.remove());
    }
  }, [activeSource, pdfDocument, createHighlightOverlay]);

  // Add CSS for highlighting
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = highlightStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const changePage = (offset) => {
    setCurrentPage(prevPage => {
      const newPage = prevPage + offset;
      return Math.max(1, Math.min(newPage, numPages || 1));
    });
  };

  return (
    <div className="pdf-viewer">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            id={`page_${index + 1}`}
            onRenderSuccess={(page) => onPageRenderSuccess(index + 1, page)}
            scale={1.0}
            loading={<div>Loading page {index + 1}...</div>}
            className={currentPage === index + 1 ? 'active-page' : ''}
            style={{
              display: currentPage === index + 1 ? 'block' : 'none',
              margin: '0 auto',
              position: 'relative'
            }}
          />
        ))}
      </Document>
      <div className="pdf-controls">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => changePage(-1)}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {numPages}
        </p>
        <button
          type="button"
          disabled={currentPage >= (numPages || 1)}
          onClick={() => changePage(1)}
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default PdfViewer;