import React, { useState, useEffect } from 'react';
import { Button } from '../components/common';
import { testBackendConnection } from '../services/apiService';

const LandingPage: React.FC = () => {
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
    
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testBackendConnection();
      setBackendConnected(isConnected);
    };
    checkConnection();
  }, []);

  const handleGetStarted = () => {
    window.location.hash = '#/signup';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-primary-600 text-white p-4 shadow-md">
            <h1 className="text-2xl font-bold text-center">Inclusive Travel Agent</h1>
        </header>
        <main id="main-content" className="flex-grow flex items-center justify-center">
            <div className="text-center p-8 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                    Travel Without Barriers.
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Meet Aura, your personal AI travel agent dedicated to planning fully accessible trips tailored to your unique needs. From finding the right hotel to ensuring attractions are navigable, we've got you covered.
                </p>
                <div className="mb-6">
                    {backendConnected === null && (
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg mb-4">
                            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Testing backend connection...
                        </div>
                    )}
                    {backendConnected === true && (
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg mb-4">
                            <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                            ✅ Connected to backend at localhost:8080
                        </div>
                    )}
                    {backendConnected === false && (
                        <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg mb-4">
                            <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                            ❌ Backend connection failed - using offline mode
                        </div>
                    )}
                </div>
                <Button onClick={handleGetStarted} className="text-lg px-8 py-4">
                    Get Started for Free
                </Button>
            </div>
        </main>
        <footer className="text-center p-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Inclusive Travel Agent. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default LandingPage;
