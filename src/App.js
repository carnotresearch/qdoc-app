import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { FileProvider } from "./components/FileContext";
import ChatPage from "./components/ChatPage";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentForm from "./components/PaymentForm";
import Login from "./components/Login";
import Cisce from "./components/Cisce";

function App() {
  const [inputLanguage, setInputLanguage] = useState("23");
  const [outputLanguage, setOutputLanguage] = useState("23");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <FileProvider>
      <Router>
        <Content
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </Router>
    </FileProvider>
  );
}

function Content({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  darkMode,
  setDarkMode,
}) {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/cisce" && (
        <Navbar
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route path="/cisce" element={<Cisce />} />
      </Routes>
    </div>
  );
}

export default App;
