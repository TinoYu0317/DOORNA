import { GoogleGenAI } from "@google/genai";
import { FrameType, RoutingResult } from "../types";

// Fallback logic for demo purposes if no API key is set
const mockRoute = (text: string): RoutingResult => {
  const lower = text.toLowerCase();
  if (lower.includes('meet') || lower.includes('schedule')) return { type: FrameType.CALENDAR, title: 'Event', summary: 'Added to Calendar', payload: { date: 'Tomorrow 2pm' } };
  if (lower.includes('buy') || lower.includes('pay') || lower.includes('$')) return { type: FrameType.FINANCE, title: 'Transaction', summary: 'Logged expense', payload: { amount: 0 } };
  if (lower.includes('key') || lower.includes('password')) return { type: FrameType.KEY, title: 'Secret', summary: 'Locked in Key', payload: { encrypted: true } };
  if (lower.includes('remind')) return { type: FrameType.REMINDER, title: 'Task', summary: 'Reminder set', payload: { due: 'Next week' } };
  return { type: FrameType.NOTE, title: 'Thought', summary: 'Saved to Notes', payload: { content: text } };
};

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  async routeInput(text: string): Promise<RoutingResult> {
    if (!this.ai) {
      console.warn("No API Key found. Using mock routing.");
      return new Promise(resolve => setTimeout(() => resolve(mockRoute(text)), 800));
    }

    try {
      const prompt = `
        You are the routing brain of Doorna. Analyze the following user input and classify it into one of these Frames:
        TODAY, CALENDAR, REMINDER, NOTE, GALLERY, FINANCE, KEY.
        
        Return ONLY a JSON object with this structure:
        {
          "type": "FRAME_ENUM_VALUE",
          "title": "Short Title",
          "summary": "Short confirmation message",
          "payload": {} 
        }

        Input: "${text}"
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const jsonStr = response.text || "{}";
      const result = JSON.parse(jsonStr);
      
      return {
        type: result.type || FrameType.NOTE,
        title: result.title || "Note",
        summary: result.summary || "Saved",
        payload: result.payload || {}
      };

    } catch (error) {
      console.error("Gemini routing failed", error);
      return mockRoute(text);
    }
  }
}

export const geminiService = new GeminiService();
