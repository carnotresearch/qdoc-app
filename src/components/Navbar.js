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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" style={{ marginLeft: "0.5cm" }} to="/">
        QDoc App
      </Link>
      <ul className="navbar-nav ms-auto">
        {token ? (
          <li className="nav-item">
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li className="nav-item">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
