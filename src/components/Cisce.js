import React, { useState, useEffect } from 'react';
import { FaPlay, FaCopy, FaCheck, FaExternalLinkAlt, FaMicrophone } from 'react-icons/fa';
import '../styles/cisce.css';

const Cisce = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [inputLanguage, setInputLanguage] = useState(23); // Default to English
  const [outputLanguage, setOutputLanguage] = useState(23); // Default to English

  useEffect(() => {
    // Set initial bot message when the page loads
    setMessages([{ text: 'Welcome to icarKnow Chat. <br /> Ask me anything about Inter School Robotics Championship, 2024', sender: 'bot', copied: false }]);
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user', copied: false }]);
      setInput('');

      try {
        const response = await fetch('https://qdocbackend.carnotresearch.com:5000/askcisce', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input, inputLanguage, outputLanguage }),
        });

        const data = await response.json();
        console.log(data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.answer, sender: 'bot', copied: false },
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
      }
    }
  };

  const playVoice = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = outputLanguage === 1 ? 'hi-IN' : 'en-US'; // Set language for voice output
    speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition(); // or window.SpeechRecognition
    recognition.lang = inputLanguage === 1 ? 'hi-IN' : 'en-US'; // Set language for voice input

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript); // Set the recognized text as input
    };

    recognition.start();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessages((prevMessages) =>
        prevMessages.map((message, i) =>
          i === index ? { ...message, copied: true } : message
        )
      );
    });
  };

  return (
    <div className="chat-page">
      <nav className="chat-navbar">
        <a href="https://iknow.carnotresearch.com">
          <img src="logo.jpg" alt="Company Logo" className="company-logo" />
        </a>
        <div className="navbar-dropdowns">
          <div className="dropdown-container">
            <label htmlFor="inputLanguage" className="dropdown-label">Input Language:</label>
            <select id="inputLanguage" value={inputLanguage} onChange={(e) => setInputLanguage(Number(e.target.value))} className="dropdown">
              <option value={23}>English</option>
              <option value={1}>Hindi</option>
              <option value={3}>Kannada</option>
              <option value={4}>Dogri</option>
              <option value={5}>Bodo</option>
              <option value={6}>Urdu</option>
              <option value={7}>Tamil</option>
              <option value={8}>Kashmiri</option>
              <option value={9}>Assamese</option>
              <option value={10}>Bengali</option>
              <option value={11}>Marathi</option>
              <option value={12}>Sindhi</option>
              <option value={13}>Maithili</option>
              <option value={14}>Punjabi</option>
              <option value={15}>Malayalam</option>
              <option value={16}>Manipuri</option>
              <option value={17}>Telugu</option>
              <option value={18}>Sanskrit</option>
              <option value={19}>Nepali</option>
              <option value={20}>Santali</option>
              <option value={21}>Gujarati</option>
              <option value={22}>Odia</option>
              <option value={2}>Gom</option>
            </select>
          </div>
          <div className="dropdown-container">
            <label htmlFor="outputLanguage" className="dropdown-label">Output Language:</label>
            <select id="outputLanguage" value={outputLanguage} onChange={(e) => setOutputLanguage(Number(e.target.value))} className="dropdown">
              <option value={23}>English</option>
              <option value={1}>Hindi</option>
              <option value={3}>Kannada</option>
              <option value={4}>Dogri</option>
              <option value={5}>Bodo</option>
              <option value={6}>Urdu</option>
              <option value={7}>Tamil</option>
              <option value={8}>Kashmiri</option>
              <option value={9}>Assamese</option>
              <option value={10}>Bengali</option>
              <option value={11}>Marathi</option>
              <option value={12}>Sindhi</option>
              <option value={13}>Maithili</option>
              <option value={14}>Punjabi</option>
              <option value={15}>Malayalam</option>
              <option value={16}>Manipuri</option>
              <option value={17}>Telugu</option>
              <option value={18}>Sanskrit</option>
              <option value={19}>Nepali</option>
              <option value={20}>Santali</option>
              <option value={21}>Gujarati</option>
              <option value={22}>Odia</option>
              <option value={2}>Gom</option>
            </select>
          </div>
        </div>
      </nav>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender === 'bot' ? 'bot' : 'user'}`}>
              <div className="message-content" dangerouslySetInnerHTML={{ __html: message.text }} />
              <div className="message-actions">
                {message.sender === 'bot' && (
                  <>
                    <button className="play-button" onClick={() => playVoice(message.text)}>
                      <FaPlay />
                    </button>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(message.text, index)}
                    >
                      {message.copied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button className="voice-button" onClick={handleVoiceInput}>
            <FaMicrophone />
          </button>
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
      </div>
      <footer className="chat-footer">
        <p>
          Powered by <a href="https://carnotresearch.com" target="_blank" rel="noopener noreferrer">Carnot Research <FaExternalLinkAlt /></a>, all rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Cisce;
