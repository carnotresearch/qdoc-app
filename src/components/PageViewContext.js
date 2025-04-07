import React, { createContext, useState, useContext, useCallback } from "react";

const PageViewContext = createContext();

export const usePageView = () => {
  const context = useContext(PageViewContext);
  if (!context) {
    throw new Error("usePageView must be used within a PageViewProvider");
  }
  return context;
};

export const PageViewProvider = ({ children }) => {
  const [pageToView, setPageToView] = useState(null);
  const [highlightPage, setHighlightPage] = useState(false);
  const [counter, setCounter] = useState(0); // Counter to force re-renders

  // Use useCallback to ensure function reference stability
  const viewPage = useCallback((filename, pageNumber) => {
    console.log(`[CONTEXT] Viewing page ${pageNumber} in ${filename}, counter: ${counter}`);
    
    // Reset first to ensure state change is detected even for same values
    setPageToView(null);
    setHighlightPage(false);
    
    // Force component update even if same page/file is selected
    setCounter(prev => prev + 1);
    
    // Use setTimeout to ensure the reset has time to process
    setTimeout(() => {
      setPageToView({ filename, pageNumber, timestamp: Date.now() });
      setHighlightPage(true);
      
      console.log(`[CONTEXT] State updated: `, { 
        filename, 
        pageNumber,
        counter: counter + 1 
      });
      
      // Reset highlight after animation completes
      setTimeout(() => {
        setHighlightPage(false);
        console.log('[CONTEXT] Highlight reset');
      }, 2000);
    }, 50);
  }, [counter]);

  return (
    <PageViewContext.Provider value={{ 
      pageToView, 
      viewPage, 
      highlightPage,
      counter // Expose counter to components for dependency arrays
    }}>
      {children}
    </PageViewContext.Provider>
  );
}; 