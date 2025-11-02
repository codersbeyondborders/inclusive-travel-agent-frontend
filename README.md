<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Inclusive Travel Agent - Frontend Application

An accessible, AI-powered travel planning application that helps users with disabilities plan personalized trips. This frontend integrates with the Inclusive Travel Agent backend API to provide context-aware, accessibility-focused travel assistance.

View your app in AI Studio: https://ai.studio/apps/drive/1qKqgDhoSsX_1PdMmURcUe-yI4wi6Pax9

## Features

- **Accessible Design**: Built with WCAG guidelines in mind, including proper ARIA labels, keyboard navigation, and screen reader support
- **Personalized User Profiles**: Comprehensive onboarding to capture accessibility needs and travel preferences
- **Context-Aware AI**: Chat interface that provides personalized responses based on user profiles
- **Speech Integration**: Voice input and text-to-speech capabilities for enhanced accessibility
- **Offline Fallback**: Local storage simulation when backend API is unavailable
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in [.env.local](.env.local):
   ```bash
   # Required: Your Gemini API key for AI responses
   GEMINI_API_KEY=your_actual_api_key_here
   
   # Optional: Backend API URL (defaults to localhost:8080)
   VITE_API_BASE_URL=http://localhost:8080
   
   # Optional: Enable local storage fallback (defaults to true)
   VITE_USE_LOCAL_STORAGE_FALLBACK=true
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Integration

This frontend is designed to work with the Inclusive Travel Agent backend API. See [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md) for detailed integration instructions.

### API Endpoints Used

- `POST /users` - Create user profiles
- `GET /users/{user_id}` - Fetch user profiles  
- `PUT /users/{user_id}` - Update user profiles
- `POST /chat` - Context-aware chat with AI

### Fallback Mode

When the backend API is unavailable, the app automatically falls back to localStorage simulation, allowing full functionality for development and testing.

## Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility throughout the application
- **Screen Reader Support**: Proper semantic HTML and ARIA labels
- **High Contrast Support**: Respects user's high contrast preferences
- **Reduced Motion**: Honors prefers-reduced-motion settings
- **Focus Management**: Clear focus indicators and logical tab order
- **Skip Links**: Skip to main content functionality

## Recent Fixes Applied

✅ **Missing CSS File**: Added `index.css` with accessibility-focused styles  
✅ **TypeScript Configuration**: Fixed type definitions in `tsconfig.json`  
✅ **API Integration**: Enhanced service layer with real API calls and fallback support  
✅ **Environment Variables**: Improved configuration management  
✅ **Accessibility Improvements**: Added ARIA labels, landmarks, and skip links  
✅ **Code Quality**: Removed outdated comments and improved error handling  

## Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.
