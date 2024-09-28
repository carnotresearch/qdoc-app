import React from "react";
import "../../styles/userManual.css";

const UserManual = () => {
  return (
    <div className="user-manual">
      <div className="container">
        <h2>User Manual for iCarKnow Chat</h2>

        <h3>Introduction</h3>
        <p>
          The iCarKnow chat is an advanced on-premise solution designed for
          secure and efficient querying across multiple documents. It
          prioritizes high data privacy, ensuring that all sensitive information
          remains within your control. With robust support for various
          languages, text-to-speech and speech-to-text, iCarKnow chat enables
          seamless querying in various languages, making it ideal for diverse
          environments.
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
        <p>
          To upload a file, click on the 3 lines in the sidebar to expand it:
        </p>
        <br></br>
        <center><img src='sidebar.png' alt="Sidebar icon" /></center>
        <br></br>
        <pre>
          Click on the New Container Button to select and upload a file from
          your device.
        </pre>
        <p>
          Once you have uploaded a file, it takes a short while to upload
          depending on the size and number of files selected.
        </p>
        <center><img
          src="upload.png"
          alt="File upload screen"
        />
</center>
        <h4>Once the files have been uploaded:</h4>
        <p>You will see the following message on the chat window:</p>
        <pre>
          You can query the documents by asking information related to the
          document in the Chat window.
        </pre>
        <p>You can even ask the chatbot to summarize the uploaded documents.</p>

        <h4>To query in different languages:</h4>
        <ul>
          <li>
            Select your question input language from the dropdown in the
            navigation bar (on the top right of the page).
          </li>
          <li>Select your input language from the dropdown shown.</li>
        </ul>
        <img
          src="input.png"
          alt="Language selection dropdown"
        />

        <h4>To listen to the speech output:</h4>
        <p>
          Click on the play button at the end of a chat message by the chatbot.
        </p>
        <img src="play.png" alt="Play button" />

        <h4>To copy the message:</h4>
        <p>Click on the pointed button:</p>
        <pre>The message will be copied to your clipboard.</pre>
        <img src="copy.png" alt="Copy button" />

        <h4>To switch between Light and Dark mode:</h4>
        <p>
          Click on the top-right moon icon button to switch to dark mode and
          click on the sun icon in dark mode to switch back to light mode.
        </p>
        <img src="light.png" alt="Dark mode icon" />

        <h4>To handle multiple documents:</h4>
        <ul>
          <li>
            When multiple documents are added to a container, they are
            automatically aligned on the left side of the interface for a clear
            and organized view.
          </li>
          <li>
            You can manage these documents by renaming the chat, making it
            easier to keep them organized.
          </li>
          <li>
            If a document is no longer needed, you can delete it by selecting
            the document and choosing the delete option, helping maintain a
            clean document collection.
          </li>
        </ul>
        <img
          src="delete.png"
          alt="Document management example"
        />

        <h4>To choose between Creative and Contextual modes:</h4>
        <ul>
          <li>
            Navigate to the mode selection option located on the interface.
          </li>
          <li>
            Select <strong>Creative Mode</strong> if you want the chatbot to
            provide inference-based answers, where it adds creative replies and
            reasons on its own.
          </li>
          <li>
            Choose <strong>Contextual Mode</strong> to have the chatbot answer
            strictly based on the uploaded documents without adding any
            additional information or reasoning.
          </li>
        </ul>
        <img src="modes.png" alt="Mode selection options" />

        <h3>Types of Questions</h3>
        <p>
          Below are the types of questions you can ask in iCarKnow Chat. The
          chatbot supports a variety of queries, from document summaries to
          inference-based creative questions:
        </p>

        <h4>Contextual Mode Questions:</h4>
        <ul>
          <li><strong>Summarization:</strong> "Summarize the key points of this document."</li>
          <li><strong>Document Insight:</strong> "What is this document about?"</li>
          <li><strong>Concept Clarification:</strong> "Explain the concept of X mentioned in the document."</li>
        </ul>

        <h4>Creative Mode Questions:</h4>
        <ul>
          <li>
            <strong>Comparative Analysis:</strong> "What do you think is the difference between X and Y?"
          </li>
          <li>
            <strong>Opinion-based Query:</strong> "Is X better than Y? Why do you think so?"
          </li>
        </ul>

        <h2>हिंदी में यूजर मैन्युअल</h2>

        <h3>परिचय</h3>
        <p>
          iCarKnow चैट एक उन्नत ऑन-प्रिमाइज़ समाधान है, जो कई दस्तावेज़ों के बीच सुरक्षित और कुशल क्वेरी के लिए डिज़ाइन किया गया है। यह उच्च डेटा गोपनीयता को प्राथमिकता देता है, जिससे आपकी सभी संवेदनशील जानकारी आपके नियंत्रण में रहती है। विभिन्न भाषाओं के लिए मज़बूत समर्थन के साथ, टेक्स्ट-टू-स्पीच और स्पीच-टू-टेक्स्ट के माध्यम से, iCarKnow चैट विभिन्न भाषाओं में क्वेरी करने में सक्षम बनाता है, जो इसे विभिन्न वातावरणों के लिए आदर्श बनाता है।
        </p>

        <h3>शुरुआत</h3>
        <h4>लॉगिन करना</h4>
        <ul>
          <li>iCarKnow चैट ऐप्लिकेशन लॉन्च करें।</li>
          <li>अपना उपयोगकर्ता नाम और पासवर्ड दर्ज करें।</li>
          <li>"लॉगिन" बटन पर क्लिक करें ताकि आप डैशबोर्ड तक पहुंच सकें।</li>
        </ul>

        <h3>मुख्य विशेषताएं</h3>
        <h4>शुरुआत कैसे करें:</h4>
        <p>
          फाइल अपलोड करने के लिए, साइडबार में 3 लाइनों पर क्लिक करके इसे विस्तृत करें:
        </p>
        <center><img src='sidebar.png' alt="Sidebar icon" /></center>
        <pre>
          "New Container" बटन पर क्लिक करें और अपनी डिवाइस से कोई फाइल अपलोड करें।
        </pre>
        <p>
          फाइल अपलोड हो जाने के बाद, यह फाइल के आकार और चुने गए दस्तावेज़ों की संख्या के आधार पर अपलोड होने में कुछ समय ले सकती है।
        </p>
        <center><img src="upload.png" alt="File upload screen" /></center>

        <h4>फाइल अपलोड हो जाने के बाद:</h4>
        <p>आप चैट विंडो में निम्न संदेश देखेंगे:</p>
        <pre>
          आप दस्तावेज़ से संबंधित जानकारी चैट विंडो में क्वेरी कर सकते हैं।
        </pre>
        <p>आप चैटबॉट से अपलोड किए गए दस्तावेज़ों का सारांश भी पूछ सकते हैं।</p>

        <h4>विभिन्न भाषाओं में क्वेरी कैसे करें:</h4>
        <ul>
          <li>
            शीर्ष दाईं ओर नेविगेशन बार में से अपनी प्रश्न इनपुट भाषा चुनें।
          </li>
          <li>दिखाए गए ड्रॉपडाउन से अपनी इनपुट भाषा चुनें।</li>
        </ul>
        <img src="input.png" alt="भाषा चयन ड्रॉपडाउन" />

        <h4>स्पीच आउटपुट सुनने के लिए:</h4>
        <p>चैटबॉट के संदेश के अंत में प्ले बटन पर क्लिक करें।</p>
        <img src="play.png" alt="Play button" />

        <h4>संदेश को कॉपी करने के लिए:</h4>
        <p>संदेश को कॉपी करने के लिए "कॉपी" बटन पर क्लिक करें:</p>
        <pre>संदेश आपके क्लिपबोर्ड पर कॉपी हो जाएगा।</pre>
        <img src="copy.png" alt="कॉपी बटन" />

        <h3>प्रश्नों के प्रकार</h3>
        <p>
          नीचे दिए गए कुछ प्रश्न हैं जिन्हें आप iCarKnow चैट में पूछ सकते हैं। यह चैटबॉट आपके अपलोड किए गए दस्तावेज़ों से संबंधित विभिन्न प्रश्नों का समर्थन करता है:
        </p>

        <h4>संदर्भ मोड प्रश्न:</h4>
        <ul>
          <li><strong>सारांश:</strong> "इस दस्तावेज़ के मुख्य बिंदुओं का सारांश दें।"</li>
          <li><strong>दस्तावेज़ की जानकारी:</strong> "यह दस्तावेज़ किस बारे में है?"</li>
          <li><strong>संकल्पना स्पष्टीकरण:</strong> "दस्तावेज़ में उल्लिखित X की व्याख्या करें।"</li>
        </ul>

        <h4>क्रिएटिव मोड प्रश्न:</h4>
        <ul>
          <li>
            <strong>तुलनात्मक विश्लेषण:</strong> "आपके अनुसार X और Y के बीच क्या अंतर है?"
          </li>
          <li>
            <strong>राय आधारित प्रश्न:</strong> "क्या X, Y से बेहतर है? आपको क्यों लगता है?"
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserManual;
