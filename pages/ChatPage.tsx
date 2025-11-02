import React, { useState, useCallback, useMemo } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { generateResponse } from '../services/geminiService';
import { ChatInterface } from '../components/ChatInterface';
import { useSpeech } from '../hooks/useSpeech';
import { useUser } from '../contexts/UserContext';
import { UserCircleIcon } from '../components/icons';

const ChatPage: React.FC = () => {
  const { profile, logout } = useUser();
  
  // Memoize session ID to keep it constant for the duration of the component's life
  const sessionId = useMemo(() => `session-${Date.now()}`, []);

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'initial-agent-message',
      text: `Hello ${profile?.basic_info.name ?? ''}! I'm Aura, your inclusive travel assistant. How can I help you plan your accessible journey today?`,
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    browserUnsupported,
  } = useSpeech({
    onListenResult: (transcript) => {
      setUserInput(prev => prev + transcript);
      stopListening(); // Stop after final result for a push-to-talk feel
    },
    onListenError: (err) => {
      setError(`Speech recognition error: ${err}`);
    },
    onSpeakEnd: () => {},
  });
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !profile?.user_id) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiResponse = await generateResponse(text, sessionId, profile.user_id);
      const agentMessage: ChatMessageType = {
        id: `agent-${Date.now()}`,
        text: apiResponse.response,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      speak(apiResponse.response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      const errorAgentMessage: ChatMessageType = {
        id: `agent-error-${Date.now()}`,
        text: "I'm sorry, I encountered an error communicating with my services. Please try again.",
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorAgentMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [speak, profile, sessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-primary-600 text-white p-4 shadow-md z-10 flex justify-between items-center">
        <div>
            <h1 className="text-xl md:text-2xl font-bold">Inclusive Travel Agent</h1>
            <p className="text-sm text-primary-50">Your AI partner for accessible travel</p>
        </div>
        <div className="flex items-center gap-2">
            <UserCircleIcon className="w-8 h-8"/>
            <span className="font-semibold hidden sm:inline">{profile?.basic_info.name}</span>
            <button onClick={logout} className="text-sm ml-4 hover:underline">Logout</button>
        </div>
      </header>
      
      <main id="main-content" className="flex-1 overflow-hidden p-0 sm:p-4">
        <ChatInterface
          messages={messages}
          userInput={userInput}
          onUserInput={setUserInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isListening={isListening}
          isSpeaking={isSpeaking}
          toggleListening={toggleListening}
          speakMessage={speak}
          stopSpeaking={stopSpeaking}
          error={error}
          browserUnsupported={browserUnsupported}
        />
      </main>
    </div>
  );
};

export default ChatPage;