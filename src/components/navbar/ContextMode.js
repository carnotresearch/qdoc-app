import React from "react";

const ContextMode = ({ mode, setMode }) => {
  return (
    <div className="mode-toggle">
      <div className={`toggle-container ${mode}`}>
        <div
          className={`option contextual-option ${
            mode === "contextual" ? "active" : ""
          }`}
          onClick={() => setMode("contextual")}
          title="Contextual Mode: Answers based on provided context, strictly sticking to the information given."
        >
          Contextual
        </div>

        <div className="slider">
          <div className="dots"></div>
        </div>

        <div
          className={`option creative-option ${
            mode === "creative" ? "active" : ""
          }`}
          onClick={() => setMode("creative")}
          title="Creative Mode: Provides more imaginative, inferred responses based on context and creativity."
        >
          Creative
        </div>
      </div>
    </div>
  );
};

export default ContextMode;
