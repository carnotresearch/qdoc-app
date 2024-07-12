import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import FileUrlForm from "./components/FileUrlForm";
import ChatPage from "./components/ChatPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentForm from "./components/payment";

function App() {
  const [submittedData, setSubmittedData] = useState({ files: [], urls: [] });
  const [inputLanguage, setInputLanguage] = useState("23");
  const [outputLanguage, setOutputLanguage] = useState("23");

  return (
    <Router>
      <div>
        <Navbar
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          submittedData={submittedData}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FileUrlForm setSubmittedData={setSubmittedData} />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/payment"
            element={
              <ProtectedRoute> 
              <PaymentForm></PaymentForm>
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
                  inputLanguage={inputLanguage}
                  outputLanguage={outputLanguage}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
