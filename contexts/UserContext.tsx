import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { fetchUserProfile, createUserProfile as apiCreateUserProfile, updateUserProfile as apiUpdateUserProfile, testBackendConnection } from '../services/apiService';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => Promise<void>;
  createProfile: (data: { name: string; email: string }) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_ID_KEY = 'inclusive_travel_user_id';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(USER_ID_KEY));

  useEffect(() => {
    const loadProfile = async () => {
      // Test backend connection on startup
      await testBackendConnection();
      
      if (userId) {
        try {
          const userProfile = await fetchUserProfile(userId);
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile, logging out.", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [userId]);

  const updateProfile = async (data: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => {
    if (!profile) return;

    const dataToUpdate = typeof data === 'function' ? data(profile) : data;
    
    setProfile(prev => prev ? { ...prev, ...dataToUpdate } : null);

    try {
        const updatedProfile = await apiUpdateUserProfile(profile.user_id, dataToUpdate);
        setProfile(updatedProfile);
    } catch (error) {
        console.error("Failed to update profile:", error);
        // Optionally revert state or show an error
    }
  };

  const createProfile = async (data: { name: string; email: string }) => {
    try {
        const newProfile = await apiCreateUserProfile(data);
        localStorage.setItem(USER_ID_KEY, newProfile.user_id);
        setUserId(newProfile.user_id);
        setProfile(newProfile);
    } catch(error) {
        console.error("Failed to create profile:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_ID_KEY);
    setUserId(null);
    setProfile(null);
    window.location.hash = '#/';
  };
  
  const value = { profile, loading, updateProfile, createProfile, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
