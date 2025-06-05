import React, { useState, useRef } from 'react';
import { Mic, AlertCircle } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import ImageDisplay from './ImageDisplay';

const TextToImageGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = 'https://shiva-ai-app.onrender.com';

  const generateImage = async () => {
    if (!inputText.trim()) {
      alert('Please enter text or use voice input');
      return;
    }

    setIsLoading(true);
    setGeneratedImage('');
    setImageError('');

    try {
      const cleanPrompt = inputText.trim().replace(/\.+$/, '');

      const response = await fetch(`${API_BASE}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data.success && data.imageUrl) {
          let imageUrl = data.imageUrl;

          if (imageUrl.startsWith('data:image/')) {
            setGeneratedImage(imageUrl);
          } else if (imageUrl.startsWith('http')) {
            if (!imageUrl.endsWith('.jpg') && !imageUrl.includes('.jpg?')) {
              const url = new URL(imageUrl);
              if (!url.pathname.endsWith('.jpg')) {
                url.pathname += '.jpg';
              }
              imageUrl = url.toString();
            }
            setGeneratedImage(imageUrl);
          } else {
            setGeneratedImage(`${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`);
          }
        } else {
          throw new Error(data.error || 'Failed to generate image');
        }
      } else if (contentType && contentType.includes('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImage(imageUrl);
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      setImageError(error.message);
      alert('Error: ' + error.message);
    }

    setIsLoading(false);
  };

  const handleVoiceResult = (text) => {
    setInputText(text);
  };

  const handleImageError = () => {
    setImageError('Failed to load the generated image. Please check your server configuration.');
  };

  const handleImageLoad = () => {
    setImageError('');
  };

  return (
    <div className="feature-section">
      <h2 className="section-title">Text to Image Generator</h2>
      
      {/* Input Section */}
      <div className="input-section">
        <div className="input-row">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="text-input"
          />
          <VoiceRecorder onResult={handleVoiceResult} />
        </div>
        
        <button
          onClick={generateImage}
          disabled={isLoading}
          className="generate-button"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <p>Generating your image...</p>
        </div>
      )}

      {/* Image Error */}
      {imageError && (
        <div className="error-container">
          <AlertCircle size={20} />
          <p>{imageError}</p>
          <small>
            Debug info: Check browser console and ensure your backend is returning the correct image URL format.
          </small>
        </div>
      )}

      {/* Generated Image */}
      <ImageDisplay 
        imageSrc={generatedImage}
        imageError={imageError}
        onImageError={handleImageError}
        onImageLoad={handleImageLoad}
        title="Generated Image:"
        altText="AI Generated Image"
      />
    </div>
  );
};

export default TextToImageGenerator;
