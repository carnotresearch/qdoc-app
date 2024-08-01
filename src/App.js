import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FileProvider } from "./components/FileContext";
import ChatPage from "./components/ChatPage";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentForm from "./components/PaymentForm";
import TrialLogin from "./components/TrialLogin";

function App() {
  const [inputLanguage, setInputLanguage] = useState("23");
  const [outputLanguage, setOutputLanguage] = useState("23");

  return (
    <FileProvider>
      <Router>
        <div>
          <Navbar
            inputLanguage={inputLanguage}
            setInputLanguage={setInputLanguage}
            outputLanguage={outputLanguage}
            setOutputLanguage={setOutputLanguage}
          />
          <Routes>
            <Route path="/login" element={<TrialLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatPage
                    inputLanguage={inputLanguage}
                    outputLanguage={outputLanguage}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </FileProvider>
  );
}

export default App;
