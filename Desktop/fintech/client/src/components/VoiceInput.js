import { Colors } from 'chart.js';
import React, { useState, useEffect, useRef } from 'react';

function VoiceInput({ onCommand }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // ✅ Keep listening
    recognition.interimResults = true; // ✅ Show partial results
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Recognition started');
      setListening(true);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

   recognition.onresult = (event) => {
  let interimTranscript = '';
  let finalTranscript = '';

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const result = event.results[i];
    if (result.isFinal) {
      finalTranscript += result[0].transcript;
    } else {
      interimTranscript += result[0].transcript;
    }
  }

  setTranscript(finalTranscript || interimTranscript);
  if (onCommand && finalTranscript) {
    onCommand(finalTranscript.toLowerCase());
  }
};

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    try {
      if (listening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start(); // ✅ Only call start after user action
      }
    } catch (err) {
      console.error('Failed to toggle recognition:', err);
    }
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button type="button" onClick={toggleListening}>
        {listening ? '🛑 Stop Listening' : '🎤 Start Listening'}
      </button>
     <p style={{
  backgroundColor: '#fff7ed',            // soft beige
  color: '#be185d',                      // deep rose to pop
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  fontWeight: '500',
  fontSize: '1.1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginTop: '1rem'
}}>
  <strong style={{ color: '#ec4899' }}>Heard:</strong> {transcript}
</p>

    </div>
  );
}

export default VoiceInput;
