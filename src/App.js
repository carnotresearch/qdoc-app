import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUrlForm from "./components/FileUrlForm";
import ChatPage from "./components/ChatPage";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [submittedData, setSubmittedData] = useState({ files: [], urls: [] });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FileUrlForm setSubmittedData={setSubmittedData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage
                submittedData={submittedData}
                setSubmittedData={setSubmittedData}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
