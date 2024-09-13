import React from "react";
import "../styles/navbar.css";


const LanguageDropdown = ({ label, selectedLanguage, languages, onChange }) => {
  return (
    <li className="nav-item dropdown">
      <button
        className="btn dropdown-toggle"
        id={`${label}LanguageDropdown`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {label}: {selectedLanguage}
      </button>
      <ul
        className="dropdown-menu"
        aria-labelledby={`${label}LanguageDropdown`}
        style={{
          maxHeight: "230px", 
          overflowY: "auto", 
        }}
      >
        {languages.map((language) => (
          <li key={language.value}>
            <button
              className="dropdown-item"
              data-value={language.value}
              onClick={() => onChange(language.value)}
            >
              {language.label}
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default LanguageDropdown;
