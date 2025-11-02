export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatApiResponse {
  response: string,
  session_id: string,
  events: Array<any>,
  user_context?: {
    user_id: string,
    context_injected: boolean,
    user_name: string,
    accessibility_needs: boolean
  }
}

export interface UserProfile {
  user_id: string;
  basic_info: {
    name: string;
    email: string;
    age?: number;
    nationality: string;
    home_location: string;
    phone?: string;
    emergency_contact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  travel_interests: {
    preferred_destinations: string[];
    travel_style: ('cultural' | 'adventure' | 'relaxation' | 'business' | 'family' | 'solo' | 'accessible')[];
    budget_range: 'budget' | 'mid-range' | 'luxury' | 'flexible';
    group_size_preference: string;
    accommodation_preferences: string[];
    activity_interests: string[];
    transportation_preferences: string[];
  };
  accessibility_profile: {
    mobility_needs: string[];
    sensory_needs: string[];
    cognitive_needs: string[];
    assistance_preferences: Record<string, string>;
    mobility_aids: string[];
    medical_conditions: string[];
    accessibility_priorities: string[];
    barrier_concerns: string[];
    dietary_restrictions: string[];
    medication_requirements: string[];
    service_animal?: {
      type: string;
      name: string;
      documentation: boolean;
    };
    communication_needs: string[];
  };
  preferences: {
    communication_style: 'brief' | 'detailed' | 'conversational' | 'professional';
    risk_tolerance: 'low' | 'medium' | 'high';
    planning_horizon: string;
    language_preferences: string[];
    currency_preference: string;
    timezone: string;
  };
  created_at: string;
  updated_at: string;
  profile_complete: boolean;
  onboarding_completed: boolean;
}
