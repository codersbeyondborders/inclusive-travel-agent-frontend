import { chat } from './apiService';
import { ChatApiResponse } from '../types';

/**
 * Sends a user's message to the backend chat service and returns the AI's response.
 * @param message The user's text message.
 * @param sessionId The current chat session ID.
 * @param userId The user's ID for personalization.
 * @returns A promise that resolves to the chat API response.
 */
export const generateResponse = async (
  message: string,
  sessionId: string,
  userId: string,
): Promise<ChatApiResponse> => {
  try {
    const response = await chat({
      message,
      session_id: sessionId,
      user_id: userId,
    });
    return response;
  } catch (error) {
    console.error("Backend chat API call failed:", error);
    throw new Error("Failed to communicate with the AI assistant.");
  }
};
