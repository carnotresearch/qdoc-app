import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sttSupportedLanguages } from "../../constant/data";

const MessageInput = ({
  inputLanguage,
  messageInputRef,
  handleSendMessage,
  handleInputFocus,
  selectedQuestion,
}) => {
  const [showMicrophone, setShowMicrophone] = useState(true);
  const sttSupportedLanguagesRef = useRef(sttSupportedLanguages);
  const [recognizing, setRecognizing] = useState(false); // voice recognizer
  const [userQuery, setUserQuery] = useState(""); // input query
  const recognition = useRef(null);

  // Update the input field when a suggested question is selected
  useEffect(() => {
    if (selectedQuestion) {
      setUserQuery(selectedQuestion);
    }
  }, [selectedQuestion]);

  useEffect(() => {
    setShowMicrophone(
      sttSupportedLanguagesRef.current.hasOwnProperty(inputLanguage)
    );
  }, [inputLanguage]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      if (sttSupportedLanguages[inputLanguage]) {
        recognition.current.lang =
          sttSupportedLanguagesRef.current[inputLanguage];
      }
      recognition.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserQuery(finalTranscript || interimTranscript);
      };
      recognition.current.onend = () => {
        setRecognizing(false);
      };
    }
  }, [inputLanguage]);

  const handleSpeechInput = () => {
    if (recognition.current) {
      if (recognizing) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
      setRecognizing(!recognizing);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recognition.current) {
      if (recognizing) {
        recognition.current.stop();
      }
    }
    setRecognizing(false);
    handleSendMessage(userQuery);
    setUserQuery("");
  };

  return (
    <Form className="d-flex" onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        id="query"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Type your question"
        ref={messageInputRef}
        style={{ marginRight: "10px" }}
        onFocus={handleInputFocus}
      />
      {showMicrophone && (
        <Button
          variant={recognizing ? "danger" : ""}
          onClick={handleSpeechInput}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </Button>
      )}
      <IconButton
        type="submit"
        aria-label=""
        style={{ color: "rgba(54, 183, 183, 0.8)", padding: "0" }}
      >
        <SendIcon />
      </IconButton>
    </Form>
  );
};

export default MessageInput;
