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

  return (
    <nav className="navbar navbar-expand-lg" style={{  position: "relative", padding: "1rem" }}>
      <Link
        className="navbar-brand"
        to="/"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Qdoc
      </Link>
      <ul className="navbar-nav ms-auto" style={{ marginRight: "1rem" }}>
        {token ? (
          <li className="nav-item">
            <button
              className="btn btn-logout"
              style={{ borderColor: "black" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        ) : (
          <li className="nav-item">
            <button
              className="btn btn-login"
              style={{ marginRight: "0.5cm", borderColor: "black" }}
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
