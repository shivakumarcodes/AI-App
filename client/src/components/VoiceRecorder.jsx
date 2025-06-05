import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';

const VoiceRecorder = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);

  const API_BASE = 'http://localhost:3001';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        await convertSpeechToText(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Error accessing microphone: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const convertSpeechToText = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch(`${API_BASE}/speech-to-text`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        onResult(data.text);
      } else {
        alert('Error converting speech: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`mic-button ${isRecording ? 'mic-button-recording' : 'mic-button-idle'}`}
      disabled={isLoading}
    >
      <Mic size={20} />
    </button>
  );
};

export default VoiceRecorder;
