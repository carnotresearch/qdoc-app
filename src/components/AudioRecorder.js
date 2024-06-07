import React, { useState } from "react";
import { ReactMic } from "react-mic"; // Example audio recording library

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData) => {
    // Do something with the recorded audio data (optional)
    console.log("Recording...");
  };

  const onStop = (recordedBlob) => {
    setAudioData(recordedBlob.blob);
  };

  const playAudio = () => {
    const audioUrl = URL.createObjectURL(audioData);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FFFFFF"
      />
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={playAudio} disabled={!audioData}>
        Play Audio
      </button>
    </div>
  );
};

export default AudioRecorder;
