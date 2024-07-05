import React from "react";

const LanguageDropdown = ({ label, selectedLanguage, languages, onChange }) => {
  return (
    <li className="nav-item dropdown" style={{ marginRight: "0.5cm" }}>
      <button
        className="btn btn-secondary dropdown-toggle"
        id={`${label}LanguageDropdown`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {label}: {selectedLanguage}
      </button>
      <ul
        className="dropdown-menu"
        aria-labelledby={`${label}LanguageDropdown`}
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
