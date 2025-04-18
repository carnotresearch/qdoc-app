import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

// Styling for suggested questions
const styles = {
  suggestedQuestionsWrapper: {
    marginBottom: "8px",
  },
  suggestedQuestionsLabel: {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#555",
    textAlign: "left",
  },
  suggestedQuestionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  suggestedQuestionItem: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    backgroundColor: "rgba(54, 183, 183, 0.05)",
    border: "1px dashed rgba(54, 183, 183, 0.7)",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.15s ease",
    color: "#333333",
    textAlign: "left",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  suggestedQuestionItemHover: {
    backgroundColor: "rgba(54, 183, 183, 0.15)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  questionIcon: {
    width: "12px",
    marginRight: "8px",
    color: "rgba(54, 183, 183, 0.8)",
  },
};

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  const [hoveredQuestion, setHoveredQuestion] = React.useState(null);

  // If no questions are provided, don't render anything
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div style={styles.suggestedQuestionsWrapper}>
      <div style={styles.suggestedQuestionsLabel}>Suggested Questions</div>
      <div style={styles.suggestedQuestionsList}>
        {questions.map((question, idx) => (
          <div
            key={idx}
            style={{
              ...styles.suggestedQuestionItem,
              ...(hoveredQuestion === idx ? styles.suggestedQuestionItemHover : {}),
            }}
            onClick={() => onQuestionClick(question)}
            title={question}
            onMouseEnter={() => setHoveredQuestion(idx)}
            onMouseLeave={() => setHoveredQuestion(null)}
          >
            <FontAwesomeIcon icon={faQuestionCircle} style={styles.questionIcon} />
            <span>{question}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions; 