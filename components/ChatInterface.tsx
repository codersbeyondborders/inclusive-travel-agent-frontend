
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { MicrophoneIcon, SendIcon, StopCircleIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  userInput: string;
  onUserInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  toggleListening: () => void;
  speakMessage: (text: string) => void;
  stopSpeaking: () => void;
  error: string | null;
  browserUnsupported: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  userInput,
  onUserInput,
  onSubmit,
  isLoading,
  isListening,
  isSpeaking,
  toggleListening,
  speakMessage,
  stopSpeaking,
  error,
  browserUnsupported
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <div id="message-list" className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isSpeaking={isSpeaking}
            onSpeak={() => speakMessage(msg.text)}
            onStopSpeak={stopSpeaking}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-text-secondary p-3 rounded-lg max-w-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {error && <div className="text-error text-sm mb-2 text-center" role="alert">{error}</div>}
        {browserUnsupported && <div className="text-warning text-sm mb-2 text-center" role="alert">Your browser does not support the Web Speech API. Please try Chrome or Edge.</div>}
        
        <form onSubmit={onSubmit} className="flex items-center space-x-2 md:space-x-4">
          <textarea
            value={userInput}
            onChange={(e) => onUserInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                }
            }}
            placeholder={isListening ? "Listening..." : "Type your message or use the microphone..."}
            className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
            rows={1}
            aria-label="Chat input"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 h-12 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isListening ? 'bg-error text-white animate-pulse' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            disabled={isLoading || browserUnsupported}
          >
            {isListening ? <StopCircleIcon /> : <MicrophoneIcon />}
          </button>
          <button
            type="submit"
            className="p-3 h-12 w-12 flex-shrink-0 bg-success text-white rounded-full hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
            aria-label="Send message"
            disabled={isLoading || !userInput.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
