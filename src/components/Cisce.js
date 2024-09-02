import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPlay, FaStop, FaCopy, FaCheck, FaExternalLinkAlt, FaMicrophone } from 'react-icons/fa';
import '../styles/cisce.css';

const Cisce = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [inputLanguage, setInputLanguage] = useState(23); // Default to English
  const [outputLanguage, setOutputLanguage] = useState(23); // Default to English
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  useEffect(() => {
    // Set initial bot message when the page loads
    setChatMessages([{ text: 'Welcome to icarKnow Chat. \n\nAsk me anything about Inter School Robotics Championship, 2024', sender: 'bots', copied: false }]);
  }, []);

  const sendChatMessage = async () => {
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { text: userInput, sender: 'users', copied: false }]);
      setUserInput('');

      try {
        const response = await fetch('https://qdocbackend.carnotresearch.com:5000/askcisce', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput, inputLanguage, outputLanguage }),
        });

        const data = await response.json();
        console.log(data);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: data.answer, sender: 'bots', copied: false },
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
      }
    }
  };

  const playVoice = (text) => {
    if (audioPlaying) {
      speechSynthesis.cancel(); // Stop the current utterance completely
      setAudioPlaying(false);
      setCurrentUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = outputLanguage === 1 ? 'hi-IN' : 'en-US'; // Set language for voice output
    utterance.onend = () => {
      setAudioPlaying(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
    setAudioPlaying(true);
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition(); // or window.SpeechRecognition
    recognition.lang = inputLanguage === 1 ? 'hi-IN' : 'en-US'; // Set language for voice input

    recognition.onresult = (event) => {
      setUserInput(event.results[0][0].transcript); // Set the recognized text as input
    };

    recognition.start();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setChatMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, copied: true } : msg
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
          <div className="dropdowncontainer">
            <label htmlFor="inputLanguage" className="dropdown-label">Input Language</label>
            <select id="inputLanguage" value={inputLanguage} onChange={(e) => setInputLanguage(Number(e.target.value))} className="dropdownn">
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
              {/* Add other language options here */}
            </select>
          </div>
          <div className="dropdowncontainer">
            <label htmlFor="outputLanguage" className="dropdown-label">Output Language</label>
            <select id="outputLanguage" value={outputLanguage} onChange={(e) => setOutputLanguage(Number(e.target.value))} className="dropdownn">
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
              {/* Add other language options here */}
            </select>
          </div>
        </div>
      </nav>
      <div className="chatcontainer">
        <div className="chat-messages">
          {chatMessages.map((chatMessage, index) => (
            <div key={index} className={`chat-message ${chatMessage.sender === 'bots' ? 'bots' : 'users'}`}>
              <div className="message-content">
                {chatMessage.sender === 'bots' ? (
                  <ReactMarkdown>{chatMessage.text}</ReactMarkdown>
                ) : (
                  chatMessage.text
                )}
              </div>
              <div className="message-actions">
                {chatMessage.sender === 'bots' && (
                  <>
                    <button className="play-button" onClick={() => playVoice(chatMessage.text)}>
                      {audioPlaying ? <FaStop /> : <FaPlay />}
                    </button>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(chatMessage.text, index)}
                    >
                      {chatMessage.copied ? <FaCheck /> : <FaCopy />}
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
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Type a message..."
            className="chatinput"
          />
          <button className="voice-button" onClick={handleVoiceInput}>
            <FaMicrophone />
          </button>
          <button onClick={sendChatMessage} className="sendbutton">Send</button>
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
