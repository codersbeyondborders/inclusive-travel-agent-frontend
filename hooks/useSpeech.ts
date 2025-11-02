
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechProps {
  onListenResult: (transcript: string) => void;
  onListenError: (error: string) => void;
  onSpeakEnd: () => void;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useSpeech = ({ onListenResult, onListenError, onSpeakEnd }: UseSpeechProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [browserUnsupported, setBrowserUnsupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            onListenResult(finalTranscript);
          }
        };

        recognitionInstance.onerror = (event) => {
          onListenError(event.error);
        };
        
        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognitionInstance;
      } else {
        setBrowserUnsupported(true);
      }

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      } else {
        setBrowserUnsupported(true);
      }
    }
  }, [onListenResult, onListenError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition start error:", e);
        onListenError("Could not start recognition. It might already be active.");
      }
    }
  }, [isListening, onListenError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (synthRef.current && text) {
      // Cancel any ongoing speech before starting a new one
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakEnd();
      };
      utterance.onerror = (e) => {
          console.error("Speech synthesis error", e);
          setIsSpeaking(false);
      };
      synthRef.current.speak(utterance);
    }
  }, [onSpeakEnd]);
  
  const stopSpeaking = useCallback(() => {
      if (synthRef.current) {
          synthRef.current.cancel();
          setIsSpeaking(false);
      }
  }, []);

  return { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking, browserUnsupported };
};
