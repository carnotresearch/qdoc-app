import React, { useState } from "react";
import "../styles/userManual.css"; // Import the CSS file for styling

const UserManual = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`user-manual ${darkMode ? "dark-mode" : ""}`}>
      <header>
        <h1>iCarKnow Chat User Manual Overview</h1>
      </header>

      <div className="container">
        <h2>User Manual for iCarKnow Chat</h2>

        <h3>Introduction</h3>
        <p>
          The iCarKnow chat is an advanced on-premise solution designed for secure and efficient
          querying across multiple documents. It prioritizes high data privacy, ensuring that all
          sensitive information remains within your control. With robust support for various
          languages, text-to-speech and speech-to-text, iCarKnow chat enables seamless querying in
          various languages, making it ideal for diverse environments.
        </p>

        <h3>Getting Started</h3>
        <h4>Logging In</h4>
        <ul>
          <li>Launch the iCarKnow Chat application.</li>
          <li>Enter your username and password.</li>
          <li>Click on the "Login" button to access the dashboard.</li>
        </ul>

        <h3>Key Features</h3>
        <h4>To start:</h4>
        <p>To upload a file, click on the 3 lines in the sidebar to expand it:</p>
        <pre>
          Click on the New Container Button to select and upload a file from your device.
        </pre>
        <p>
          Once you have uploaded a file, it takes a short while to upload depending on the size and
          number of files selected.
        </p>

        <h4>Once the files have been uploaded:</h4>
        <p>You will see the following message on the chat window:</p>
        <pre>
          You can query the documents by asking information related to the document in the Chat
          window.
        </pre>
        <p>You can even ask the chatbot to summarize the uploaded documents.</p>

        <h4>To query in different languages:</h4>
        <ul>
          <li>
            Select your question input language from the dropdown in the navigation bar (on the top
            right of the page).
          </li>
          <li>Select your output language from the dropdown shown.</li>
        </ul>

        <h4>To listen to the speech output:</h4>
        <p>Click on the play button at the end of a chat message by the chatbot.</p>

        <h4>To copy the message:</h4>
        <p>Click on the pointed button:</p>
        <pre>The message will be copied to your clipboard.</pre>

        <h4>To switch between Light and Dark mode:</h4>
        <p>
          Click on the top-right moon icon button to switch to dark mode and click on the sun icon
          in dark mode to switch back to light mode.
        </p>

        <h4>To handle multiple documents:</h4>
        <ul>
          <li>
            When multiple documents are added to a container, they are automatically aligned on the
            left side of the interface for a clear and organized view.
          </li>
          <li>
            You can manage these documents by renaming the chat, making it easier to keep them
            organized.
          </li>
          <li>
            If a document is no longer needed, you can delete it by selecting the document and
            choosing the delete option, helping maintain a clean document collection.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserManual;
