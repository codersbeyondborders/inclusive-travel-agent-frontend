import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import { LoadingIcon } from './components/icons';

const AppContent: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash || '#/');
    const { profile, loading } = useUser();

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash || '#/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (loading) return;

        const onboardingComplete = profile?.onboarding_completed ?? false;
        
        if (profile && onboardingComplete && (route === '#/' || route === '#/signup')) {
            window.location.hash = '#/chat';
        } else if (profile && !onboardingComplete && route !== '#/onboarding') {
            window.location.hash = '#/onboarding';
        } else if (!profile && (route === '#/chat' || route === '#/onboarding')) {
            window.location.hash = '#/';
        }
    }, [route, profile, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <LoadingIcon className="w-12 h-12 animate-spin text-primary-600" />
                    <p className="text-text-secondary">Loading your profile...</p>
                </div>
            </div>
        );
    }
    
    let page;
    switch (route) {
        case '#/signup':
            page = <SignUpPage />;
            break;
        case '#/onboarding':
            page = <OnboardingPage />;
            break;
        case '#/chat':
            page = <ChatPage />;
            break;
        case '#/':
        default:
            page = <LandingPage />;
            break;
    }

    return (
        <div className="antialiased text-text-primary">
            {page}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
};

export default App;
