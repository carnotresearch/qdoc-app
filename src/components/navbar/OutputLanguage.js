import React from "react";
import { languages } from "../../constant/data";
import LanguageGridSelector from "./LanguageGridSelector";

const OutputLanguage = ({ outputLanguage, setOutputLanguage, darkMode }) => {
  return (
    <LanguageGridSelector
      label="Output"
      selectedLanguage={
        languages.find((lang) => lang.value === outputLanguage)?.label ||
        "English"
      }
      onChange={setOutputLanguage}
      darkMode={darkMode}
    />
  );
};

export default OutputLanguage;
