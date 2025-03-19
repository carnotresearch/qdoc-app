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
import Login from "./components/Login";
import Pricing from "./components/Pricing";
import Home from "./components/home";
import Demo from "./components/Demo";

function App() {
  const [inputLanguage, setInputLanguage] = useState("23");
  const [outputLanguage, setOutputLanguage] = useState("23");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFileUpdated, setIsFileUpdated] = useState(false);

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
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isFileUpdated={isFileUpdated}
          setIsFileUpdated={setIsFileUpdated}
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
  isLoggedIn,
  setIsLoggedIn,
  isFileUpdated,
  setIsFileUpdated,
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
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isFileUpdated={isFileUpdated}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/Pricing"
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ProtectedRoute>
                <ChatPage
                  inputLanguage={inputLanguage}
                  outputLanguage={outputLanguage}
                  setIsLoggedIn={setIsLoggedIn}
                />
              </ProtectedRoute>
            ) : (
              <Home
                inputLanguage={inputLanguage}
                outputLanguage={outputLanguage}
                isFileUpdated={isFileUpdated}
                setIsFileUpdated={setIsFileUpdated}
              />
            )
          }
        />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </div>
  );
}

export default App;
