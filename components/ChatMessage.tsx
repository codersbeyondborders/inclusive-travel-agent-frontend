
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { SpeakerWaveIcon, StopIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStopSpeak: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSpeaking, onSpeak, onStopSpeak }) => {
  const isAgent = message.sender === 'agent';
  const bubbleClasses = isAgent
    ? 'bg-gray-200 text-text-secondary rounded-br-none'
    : 'bg-primary-600 text-white rounded-bl-none';
  const containerClasses = isAgent ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`p-3 rounded-xl max-w-lg md:max-w-2xl ${bubbleClasses} relative group`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <time className={`text-xs mt-2 block ${isAgent ? 'text-gray-500' : 'text-primary-50'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
        {isAgent && (
          <div className="absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={isSpeaking ? onStopSpeak : onSpeak}
                aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
                className="p-2 bg-white text-primary-600 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                {isSpeaking ? <StopIcon /> : <SpeakerWaveIcon />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
