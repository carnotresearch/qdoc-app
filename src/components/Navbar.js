import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
        QDoc App
      </Link>
      <ul className="navbar-nav ms-auto">
        {token ? (
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
