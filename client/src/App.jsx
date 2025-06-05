import React, { useState } from 'react';
import { Image, Upload, FileText, Bot } from 'lucide-react';
import TabButton from './components/TabButton';
import TextToImageGenerator from './components/TextToImageGenerator';
import ObjectDetection from './components/ObjectDetection';
import PDFSummarizer from './components/PDFSummarizer';
import AIInterviewer from './components/AIInterviewer';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('text-to-image');

  const tabs = [
    { id: 'text-to-image', icon: Image, label: 'Text to Image' },
    { id: 'object-detection', icon: Upload, label: 'Object Detection' },
    { id: 'pdf-summary', icon: FileText, label: 'PDF Summary' },
    { id: 'interviewer', icon: Bot, label: 'AI Interviewer' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'text-to-image':
        return <TextToImageGenerator />;
      case 'object-detection':
        return <ObjectDetection />;
      case 'pdf-summary':
        return <PDFSummarizer />;
      case 'interviewer':
        return <AIInterviewer />;
      default:
        return <TextToImageGenerator />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <h1 className="app-title">AI Multi-Feature App</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="content-area">
          {renderActiveComponent()}
        </div>

        {/* Footer
        <div className="app-footer">
          <p>Built with React + Node.js + Free AI APIs</p>
        </div> */}
      </div>
    </div>
  );
};

export default App;
// import React, { useState, useRef } from 'react';
// import { Mic, Upload, MessageCircle, Image, FileText, Send, Bot, AlertCircle } from 'lucide-react';
// import './App.css';

// const App = () => {
//   const [activeTab, setActiveTab] = useState('text-to-image');
//   const [inputText, setInputText] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState('');
//   const [imageError, setImageError] = useState('');
//   const [detectedObjects, setDetectedObjects] = useState([]);
//   const [pdfSummary, setPdfSummary] = useState('');
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [interviewStarted, setInterviewStarted] = useState(false);
  
//   const fileInputRef = useRef(null);
//   const pdfInputRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const API_BASE = 'http://localhost:3001';

//   // Voice Recording
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
      
//       const chunks = [];
//       mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunks, { type: 'audio/wav' });
//         await convertSpeechToText(blob);
//         stream.getTracks().forEach(track => track.stop());
//       };
      
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       alert('Error accessing microphone: ' + error.message);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const convertSpeechToText = async (audioBlob) => {
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('audio', audioBlob, 'recording.wav');
      
//       const response = await fetch(`${API_BASE}/speech-to-text`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setInputText(data.text);
//       } else {
//         alert('Error converting speech: ' + data.error);
//       }
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//     setIsLoading(false);
//   };

//   // Text to Image Generation
// const generateImage = async () => {
//   if (!inputText.trim()) {
//     alert('Please enter text or use voice input');
//     return;
//   }

//   setIsLoading(true);
//   setGeneratedImage('');
//   setImageError('');

//   try {
//     const cleanPrompt = inputText.trim().replace(/\.+$/, ''); // Remove trailing periods

//     const response = await fetch(`${API_BASE}/generate-image`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ prompt: cleanPrompt }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const contentType = response.headers.get('content-type');

//     if (contentType && contentType.includes('application/json')) {
//       const data = await response.json();
//       console.log('Image generation response:', data);

//       if (data.success && data.imageUrl) {
//         let imageUrl = data.imageUrl;

//         if (imageUrl.startsWith('data:image/')) {
//           // base64 data
//           setGeneratedImage(imageUrl);
//         } else if (imageUrl.startsWith('http')) {
//           // Ensure .jpg is appended if not present and not in query
//           if (
//             !imageUrl.endsWith('.jpg') &&
//             !imageUrl.includes('.jpg?')
//           ) {
//             const url = new URL(imageUrl);
//             if (!url.pathname.endsWith('.jpg')) {
//               url.pathname += '.jpg';
//             }
//             imageUrl = url.toString();
//           }
//           setGeneratedImage(imageUrl);
//         } else {
//           // Relative path - construct full URL
//           setGeneratedImage(`${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`);
//         }
//       } else {
//         throw new Error(data.error || 'Failed to generate image');
//       }
//     } else if (contentType && contentType.includes('image/')) {
//       const blob = await response.blob();
//       const imageUrl = URL.createObjectURL(blob);
//       setGeneratedImage(imageUrl);
//     } else {
//       throw new Error('Unexpected response format from server');
//     }
//   } catch (error) {
//     console.error('Image generation error:', error);
//     setImageError(error.message);
//     alert('Error: ' + error.message);
//   }

//   setIsLoading(false);
// };


//   // Handle image load error
//   const handleImageError = (e) => {
//     console.error('Image failed to load:', e.target.src);
//     setImageError('Failed to load the generated image. Please check your server configuration.');
//   };

//   // Handle image load success
//   const handleImageLoad = () => {
//     setImageError('');
//     console.log('Image loaded successfully');
//   };

//   // Object Detection in Image
// const handleImageUpload = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;
  
//   setIsLoading(true);
//   setDetectedObjects([]); // Clear previous results
  
//   try {
//     const formData = new FormData();
//     formData.append('image', file);
    
//     const response = await fetch(`${API_BASE}/detect-objects`, {
//       method: 'POST',
//       body: formData,
//     });
    
//     const data = await response.json();
//     if (data.success) {
//       setDetectedObjects(data.objects);
      
//       // Show preview of uploaded image
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setGeneratedImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert(data.error || 'Error detecting objects');
//       if (data.apiError) {
//         console.error('API Error:', data.apiError);
//       }
//     }
//   } catch (error) {
//     alert('Error: ' + error.message);
//     console.error('Upload error:', error);
//   }
//   setIsLoading(false);
// };

//   // PDF Summarization
//   const handlePdfUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
    
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);
      
//       const response = await fetch(`${API_BASE}/summarize-pdf`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setPdfSummary(data.summary);
//       } else {
//         alert('Error summarizing PDF: ' + data.error);
//       }
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//     setIsLoading(false);
//   };

//   // AI Interviewer Chat
//   const startInterview = async () => {
//     setInterviewStarted(true);
//     setChatMessages([]);
//     setIsLoading(true);
    
//     try {
//       const response = await fetch(`${API_BASE}/start-interview`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setChatMessages([{ role: 'assistant', content: data.message }]);
//       }
//     } catch (error) {
//       alert('Error starting interview: ' + error.message);
//     }
//     setIsLoading(false);
//   };

//   const sendChatMessage = async () => {
//     if (!chatInput.trim()) return;
    
//     const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
//     setChatMessages(newMessages);
//     setChatInput('');
//     setIsLoading(true);
    
//     try {
//       const response = await fetch(`${API_BASE}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: newMessages }),
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setChatMessages([...newMessages, { role: 'assistant', content: data.message }]);
//       }
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//     setIsLoading(false);
//   };

//   const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
//     <button
//       onClick={() => onClick(id)}
//       className={`tab-button ${isActive ? 'tab-button-active' : 'tab-button-inactive'}`}
//     >
//       <Icon size={20} />
//       {label}
//     </button>
//   );

//   return (
//     <div className="app-container">
//       <div className="app-wrapper">
//         <h1 className="app-title">
//           AI Multi-Feature App
//         </h1>

//         {/* Tab Navigation */}
//         <div className="tab-navigation">
//           <TabButton 
//             id="text-to-image" 
//             icon={Image} 
//             label="Text to Image" 
//             isActive={activeTab === 'text-to-image'}
//             onClick={setActiveTab}
//           />
//           <TabButton 
//             id="object-detection" 
//             icon={Upload} 
//             label="Object Detection" 
//             isActive={activeTab === 'object-detection'}
//             onClick={setActiveTab}
//           />
//           <TabButton 
//             id="pdf-summary" 
//             icon={FileText} 
//             label="PDF Summary" 
//             isActive={activeTab === 'pdf-summary'}
//             onClick={setActiveTab}
//           />
//           <TabButton 
//             id="interviewer" 
//             icon={Bot} 
//             label="AI Interviewer" 
//             isActive={activeTab === 'interviewer'}
//             onClick={setActiveTab}
//           />
//         </div>

//         {/* Content Area */}
//         <div className="content-area">
//           {activeTab === 'text-to-image' && (
//             <div className="feature-section">
//               <h2 className="section-title">Text to Image Generator</h2>
              
//               {/* Input Section */}
//               <div className="input-section">
//                 <div className="input-row">
//                   <input
//                     type="text"
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     placeholder="Describe the image you want to generate..."
//                     className="text-input"
//                   />
//                   <button
//                     onClick={isRecording ? stopRecording : startRecording}
//                     className={`mic-button ${isRecording ? 'mic-button-recording' : 'mic-button-idle'}`}
//                   >
//                     <Mic size={20} />
//                   </button>
//                 </div>
                
//                 <button
//                   onClick={generateImage}
//                   disabled={isLoading}
//                   className="generate-button"
//                 >
//                   {isLoading ? 'Generating...' : 'Generate Image'}
//                 </button>
//               </div>

//               {/* Loading State */}
//               {isLoading && activeTab === 'text-to-image' && (
//                 <div className="loading-container">
//                   <p>Generating your image...</p>
//                 </div>
//               )}

//               {/* Image Error */}
//               {imageError && (
//                 <div className="error-container">
//                   <AlertCircle size={20} />
//                   <p>{imageError}</p>
//                   <small>
//                     Debug info: Check browser console and ensure your backend is returning the correct image URL format.
//                   </small>
//                 </div>
//               )}

//               {/* Generated Image */}
//               {generatedImage && !imageError && (
//   <div className="image-container">
//     <h3 className="results-title">Generated Image:</h3>
//     <img 
//       src={generatedImage} 
//       alt="AI Generated Image"
//       className="generated-image"
//       onError={handleImageError}
//       onLoad={handleImageLoad}
//       crossOrigin="anonymous"  // Add this if loading from different origin
//     />
//     <div className="image-info">
//       <small>Image source: {generatedImage.length > 100 ? 
//         `${generatedImage.substring(0, 100)}...` : 
//         generatedImage}
//       </small>
//     </div>
//   </div>
// )}
//             </div>
//           )}

//           {activeTab === 'object-detection' && (
//   <div className="feature-section">
//     <h2 className="section-title">Object Detection</h2>
    
//     <div className="upload-section">
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         className="hidden-input"
//       />
//       <button
//         onClick={() => fileInputRef.current?.click()}
//         disabled={isLoading}
//         className="upload-button upload-button-green"
//       >
//         <Upload size={20} />
//         {isLoading ? 'Analyzing...' : 'Upload Image'}
//       </button>
//     </div>

//     {/* Show uploaded image preview */}
//     {generatedImage && (
//       <div className="image-container">
//         <h3 className="results-title">Uploaded Image:</h3>
//         <img 
//           src={generatedImage} 
//           alt="Uploaded for detection"
//           className="uploaded-image"
//           onError={() => setImageError('Failed to load uploaded image')}
//         />
//       </div>
//     )}

//     {/* Show detection results */}
//     {detectedObjects.length > 0 && (
//       <div className="results-container">
//         <h3 className="results-title">Detected Objects:</h3>
//         <div className="tags-container">
//           {detectedObjects.map((obj, index) => (
//             <span key={index} className="object-tag">
//               {obj}
//             </span>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// )}

//           {activeTab === 'pdf-summary' && (
//             <div className="feature-section">
//               <h2 className="section-title">PDF Summarizer</h2>
              
//               <div className="upload-section">
//                 <input
//                   ref={pdfInputRef}
//                   type="file"
//                   accept=".pdf"
//                   onChange={handlePdfUpload}
//                   className="hidden-input"
//                 />
//                 <button
//                   onClick={() => pdfInputRef.current?.click()}
//                   disabled={isLoading}
//                   className="upload-button upload-button-orange"
//                 >
//                   <FileText size={20} />
//                   {isLoading ? 'Processing...' : 'Upload PDF'}
//                 </button>
//               </div>

//               {pdfSummary && (
//                 <div className="summary-container">
//                   <h3 className="results-title">Summary:</h3>
//                   <p className="summary-text">{pdfSummary}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'interviewer' && (
//             <div className="feature-section">
//               <h2 className="section-title">AI Interviewer</h2>
              
//               {!interviewStarted ? (
//                 <div className="upload-section">
//                   <button
//                     onClick={startInterview}
//                     disabled={isLoading}
//                     className="upload-button upload-button-purple"
//                   >
//                     <MessageCircle size={20} />
//                     {isLoading ? 'Starting...' : 'Start Interview'}
//                   </button>
//                 </div>
//               ) : (
//                 <div className="chat-section">
//                   {/* Chat Messages */}
//                   <div className="chat-messages">
//                     {chatMessages.map((message, index) => (
//                       <div
//                         key={index}
//                         className={`message-wrapper ${message.role === 'user' ? 'message-wrapper-user' : 'message-wrapper-assistant'}`}
//                       >
//                         <div
//                           className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
//                         >
//                           {message.content}
//                         </div>
//                       </div>
//                     ))}
//                     {isLoading && (
//                       <div className="message-wrapper message-wrapper-assistant">
//                         <div className="message message-assistant">
//                           Typing...
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Chat Input */}
//                   <div className="chat-input-section">
//                     <input
//                       type="text"
//                       value={chatInput}
//                       onChange={(e) => setChatInput(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
//                       placeholder="Type your response..."
//                       className="chat-input"
//                     />
//                     <button
//                       onClick={sendChatMessage}
//                       disabled={isLoading || !chatInput.trim()}
//                       className="send-button"
//                     >
//                       <Send size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="app-footer">
//           <p>Built with React + Node.js + Free AI APIs</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;