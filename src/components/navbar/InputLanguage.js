import React from "react";
import { languages } from "../../constant/data";
import LanguageGridSelector from "./LanguageGridSelector";

const InputLanguage = ({ inputLanguage, setInputLanguage, darkMode }) => {
  return (
    <LanguageGridSelector
      label="Input"
      selectedLanguage={
        languages.find((lang) => lang.value === inputLanguage)?.label ||
        "English"
      }
      onChange={setInputLanguage}
      darkMode={darkMode}
    />
  );
};

export default InputLanguage;
