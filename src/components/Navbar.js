import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { focusEmail: true } });
  };

  const handleOpenHtml = () => {
    const htmlContent = localStorage.getItem("htmlContent");
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const handleLanguageChange = (type, event) => {
    const newLanguage = event.target.value;
    if (type === "inputLanguage") {
      setInputLanguage(newLanguage);
    } else {
      setOutputLanguage(newLanguage);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
        QDoc App
      </Link>
      <ul className="navbar-nav ms-auto">
        {token ? (
          <>
            {location.pathname === "/chat" && (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: "0.25cm" }}
                    onClick={handleOpenHtml}
                  >
                    Graph
                  </button>
                </li>
                <li className="nav-item">
                  <select
                    className="form-select"
                    value={inputLanguage}
                    onChange={(event) =>
                      handleLanguageChange("inputLanguage", event)
                    }
                    style={{ marginRight: "0.5cm" }}
                  >
                    <option value="23">English</option>
                    <option value="1">Hindi</option>
                    <option value="2">Gom</option>
                    <option value="3">Kannada</option>
                    <option value="4">Dogri</option>
                    <option value="5">Bodo</option>
                    <option value="6">Urdu</option>
                    <option value="7">Tamil</option>
                    <option value="8">Kashmiri</option>
                    <option value="9">Assamese</option>
                    <option value="10">Bengali</option>
                    <option value="11">Marathi</option>
                    <option value="12">Sindhi</option>
                    <option value="13">Maithili</option>
                    <option value="14">Punjabi</option>
                    <option value="15">Malayalam</option>
                    <option value="16">Manipuri</option>
                    <option value="17">Telugu</option>
                    <option value="18">Sanskrit</option>
                    <option value="19">Nepali</option>
                    <option value="20">Santali</option>
                    <option value="21">Gujarati</option>
                    <option value="22">Odia</option>
                  </select>
                </li>
                <li className="nav-item">
                  <select
                    className="form-select"
                    value={outputLanguage}
                    onChange={(event) =>
                      handleLanguageChange("outputLanguage", event)
                    }
                    style={{ marginRight: "0.5cm" }}
                  >
                    <option value="23">English</option>
                    <option value="1">Hindi</option>
                    <option value="2">Gom</option>
                    <option value="3">Kannada</option>
                    <option value="4">Dogri</option>
                    <option value="5">Bodo</option>
                    <option value="6">Urdu</option>
                    <option value="7">Tamil</option>
                    <option value="8">Kashmiri</option>
                    <option value="9">Assamese</option>
                    <option value="10">Bengali</option>
                    <option value="11">Marathi</option>
                    <option value="12">Sindhi</option>
                    <option value="13">Maithili</option>
                    <option value="14">Punjabi</option>
                    <option value="15">Malayalam</option>
                    <option value="16">Manipuri</option>
                    <option value="17">Telugu</option>
                    <option value="18">Sanskrit</option>
                    <option value="19">Nepali</option>
                    <option value="20">Santali</option>
                    <option value="21">Gujarati</option>
                    <option value="22">Odia</option>
                  </select>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="btn btn-secondary"
                style={{ marginRight: "0.25cm" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <button
              style={{ marginRight: "0.5cm" }}
              className="btn btn-primary"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
