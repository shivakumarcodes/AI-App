import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

const AIInterviewer = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = 'http://localhost:3001';

  const startInterview = async () => {
    setInterviewStarted(true);
    setChatMessages([]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/start-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      if (data.success) {
        setChatMessages([{ role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      alert('Error starting interview: ' + error.message);
    }
    setIsLoading(false);
  };

  const sendMessage = async (message) => {
    const newMessages = [...chatMessages, { role: 'user', content: message }];
    setChatMessages(newMessages);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await response.json();
      if (data.success) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="feature-section">
      <h2 className="section-title">AI Interviewer</h2>
      
      {!interviewStarted ? (
        <div className="upload-section">
          <button
            onClick={startInterview}
            disabled={isLoading}
            className="upload-button upload-button-purple"
          >
            <MessageCircle size={20} />
            {isLoading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      ) : (
        <ChatInterface 
          messages={chatMessages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AIInterviewer;
