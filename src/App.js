import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUrlForm from "./components/FileUrlForm";
import ChatPage from "./components/ChatPage";

function App() {
  const [submittedData, setSubmittedData] = useState({ files: [], urls: [] });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FileUrlForm setSubmittedData={setSubmittedData} />}
        />
        <Route
          path="/chat"
          element={
            <ChatPage
              submittedData={submittedData}
              setSubmittedData={setSubmittedData}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
