import React, { createContext, useState } from "react";

export const SourceContext = createContext();

export const SourceProvider = ({ children }) => {
  const [activeSource, setActiveSource] = useState(null);

  return (
    <SourceContext.Provider value={{ activeSource, setActiveSource }}>
      {children}
    </SourceContext.Provider>
  );
}; 