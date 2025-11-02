import React from 'react';
import { Button } from '../components/common';

const LandingPage: React.FC = () => {
    
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
