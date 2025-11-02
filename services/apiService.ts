import { UserProfile, ChatApiResponse } from '../types';

// API service for the Inclusive Travel Agent backend
// Supports both development (localhost) and production environments

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://your-cloud-run-service-url' 
    : 'http://localhost:8080');

// Log the configuration on startup
console.log('API Configuration:', {
  API_BASE_URL,
  USE_LOCAL_STORAGE_FALLBACK: import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK,
  IS_ONLINE: navigator.onLine,
  ENV_MODE: import.meta.env.MODE
});

/**
 * Health check to test backend connectivity
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log(`Testing backend connection to: ${API_BASE_URL}/agent/info`);
    const response = await fetch(`${API_BASE_URL}/agent/info`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful!', data);
      return true;
    } else {
      console.warn('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.warn('❌ Backend connection failed:', error);
    return false;
  }
};
const DB_USER_PREFIX = 'db_user_';

// --- User Profile Management ---

const defaultProfileData: Omit<UserProfile, 'user_id' | 'basic_info' | 'created_at' | 'updated_at'> = {
  travel_interests: {
    preferred_destinations: [],
    travel_style: [],
    budget_range: 'mid-range',
    group_size_preference: '',
    accommodation_preferences: [],
    activity_interests: [],
    transportation_preferences: [],
  },
  accessibility_profile: {
    mobility_needs: [],
    sensory_needs: [],
    cognitive_needs: [],
    assistance_preferences: {},
    mobility_aids: [],
    medical_conditions: [],
    accessibility_priorities: [],
    barrier_concerns: [],
    dietary_restrictions: [],
    medication_requirements: [],
    communication_needs: [],
  },
  preferences: {
    communication_style: 'conversational',
    risk_tolerance: 'medium',
    planning_horizon: '',
    language_preferences: ['en-US'],
    currency_preference: 'USD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  profile_complete: false,
  onboarding_completed: false,
};


/**
 * POST /users
 * Creates a new user profile.
 */
export const createUserProfile = async (data: { name: string; email: string }): Promise<UserProfile> => {
  // Only use localStorage fallback if explicitly disabled or offline
  const useLocalFallback = import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK === 'true' && !navigator.onLine;
  
  if (useLocalFallback) {
    console.log('Using localStorage fallback (offline mode)');
    return createUserProfileLocal(data);
  }

  try {
    console.log(`Making API call to: ${API_BASE_URL}/users`);
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basic_info: {
          name: data.name,
          email: data.email,
          nationality: '',
          home_location: '',
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response received:', result);
    return result.profile;
  } catch (error) {
    console.warn('API call failed, falling back to local storage:', error);
    return createUserProfileLocal(data);
  }
};

// Local storage fallback implementation
const createUserProfileLocal = (data: { name: string; email: string }): Promise<UserProfile> => {
  return new Promise((resolve) => {
    const now = new Date().toISOString();
    const userId = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      ...defaultProfileData,
      user_id: userId,
      basic_info: {
        name: data.name,
        email: data.email,
        nationality: '',
        home_location: '',
      },
      created_at: now,
      updated_at: now,
    };
    localStorage.setItem(`${DB_USER_PREFIX}${userId}`, JSON.stringify(newProfile));
    setTimeout(() => resolve(newProfile), 500);
  });
};

/**
 * GET /users/{user_id}
 * Fetches a user profile.
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Only use localStorage fallback if explicitly disabled or offline
  const useLocalFallback = import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK === 'true' && !navigator.onLine;
  
  if (useLocalFallback) {
    console.log('Using localStorage fallback (offline mode)');
    return fetchUserProfileLocal(userId);
  }

  try {
    console.log(`Making API call to: ${API_BASE_URL}/users/${userId}`);
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response received:', result);
    return result.profile;
  } catch (error) {
    console.warn('API call failed, falling back to local storage:', error);
    return fetchUserProfileLocal(userId);
  }
};

// Local storage fallback implementation
const fetchUserProfileLocal = (userId: string): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    const storedProfile = localStorage.getItem(`${DB_USER_PREFIX}${userId}`);
    if (storedProfile) {
      setTimeout(() => resolve(JSON.parse(storedProfile)), 500);
    } else {
      setTimeout(() => reject(new Error('User not found')), 500);
    }
  });
};

/**
 * PUT /users/{user_id}
 * Updates a user profile.
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  // Only use localStorage fallback if explicitly disabled or offline
  const useLocalFallback = import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK === 'true' && !navigator.onLine;
  
  if (useLocalFallback) {
    console.log('Using localStorage fallback (offline mode)');
    return updateUserProfileLocal(userId, data);
  }

  try {
    console.log(`Making API call to: ${API_BASE_URL}/users/${userId}`);
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response received:', result);
    return result.profile;
  } catch (error) {
    console.warn('API call failed, falling back to local storage:', error);
    return updateUserProfileLocal(userId, data);
  }
};

// Local storage fallback implementation
const updateUserProfileLocal = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const existingProfile = await fetchUserProfileLocal(userId);
    const updatedProfile = { 
        ...existingProfile, 
        ...data,
        basic_info: { ...existingProfile.basic_info, ...data.basic_info },
        travel_interests: { ...existingProfile.travel_interests, ...data.travel_interests },
        accessibility_profile: { ...existingProfile.accessibility_profile, ...data.accessibility_profile },
        preferences: { ...existingProfile.preferences, ...data.preferences },
        updated_at: new Date().toISOString() 
      };
    localStorage.setItem(`${DB_USER_PREFIX}${userId}`, JSON.stringify(updatedProfile));
    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedProfile), 300);
    });
  } catch (error) {
    throw error;
  }
};


// --- Context-Aware Chat ---

/**
 * POST /chat
 * Sends a message to the chat endpoint.
 */
export const chat = async (body: { message: string; session_id: string; user_id?: string }): Promise<ChatApiResponse> => {
  // Only use localStorage fallback if explicitly disabled or offline
  const useLocalFallback = import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK === 'true' && !navigator.onLine;
  
  if (useLocalFallback) {
    console.log('Using localStorage fallback (offline mode)');
    return chatLocal(body);
  }

  try {
    console.log(`Making API call to: ${API_BASE_URL}/chat`);
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response received:', result);
    return result;
  } catch (error) {
    console.warn('API call failed, falling back to local simulation:', error);
    return chatLocal(body);
  }
};

// Local simulation fallback implementation
const chatLocal = async (body: { message: string; session_id: string; user_id?: string }): Promise<ChatApiResponse> => {
  return new Promise(async (resolve) => {
    let responseText = `I have received your message: "${body.message}". I am processing your request.`;
    let userName = 'User';
    
    if (body.user_id) {
        try {
            const profile = await fetchUserProfileLocal(body.user_id);
            userName = profile.basic_info.name;
            responseText = `Hello ${profile.basic_info.name}! I've received your message: "${body.message}". I am taking your accessibility needs and travel preferences into account while I find the perfect options for you.`
        } catch {
            // fail silently if profile not found
        }
    }

    const response: ChatApiResponse = {
      response: responseText,
      session_id: body.session_id,
      events: [],
      user_context: {
        user_id: body.user_id || '',
        context_injected: !!body.user_id,
        user_name: userName,
        accessibility_needs: true
      }
    };
    setTimeout(() => resolve(response), 1200);
  });
};
