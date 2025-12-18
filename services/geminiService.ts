
import { GoogleGenAI } from "@google/genai";

/**
 * Initializes a new Gemini chat session with specific herbal expert instructions.
 * Creates a fresh GoogleGenAI instance for each session to ensure the latest API key is used.
 */
export const getChatSession = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are the Green Leaf Assistant, a friendly and knowledgeable herbal expert for the Green Leaf Herbals store. You help customers find the right organic and Ayurvedic products for their wellness needs. Keep responses helpful, concise, and professional.',
    },
  });
};
