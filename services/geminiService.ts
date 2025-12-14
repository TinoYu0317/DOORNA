import { FrameType, RoutingResult } from "../types";

// Fallback logic if backend is unavailable or VITE_AI_ENDPOINT is not set
const mockRoute = (text: string): RoutingResult => {
  console.log("⚠️ Using Mock Route logic (Backend unavailable or not configured)");
  const lower = text.toLowerCase();
  
  if (lower.includes('meet') || lower.includes('schedule')) {
      return { type: FrameType.CALENDAR, title: 'Event', summary: 'Added to Calendar', payload: { date: 'Tomorrow 2pm' } };
  }
  
  if (lower.includes('buy') || lower.includes('pay') || lower.includes('$')) {
      return { type: FrameType.FINANCE, title: 'Transaction', summary: 'Logged expense', payload: { amount: 0 } };
  }
  
  if (lower.includes('key') || lower.includes('password')) {
      return { type: FrameType.KEY, title: 'Secret', summary: 'Locked in Key', payload: { encrypted: true } };
  }
  
  if (lower.includes('remind')) {
      return { type: FrameType.REMINDER, title: 'Task', summary: 'Reminder set', payload: { due: 'Next week' } };
  }

  // NOTE Logic: Determine Genre
  let genre = 'General';
  if (lower.includes('food') || lower.includes('recipe') || lower.includes('cook')) genre = 'Food';
  else if (lower.includes('gym') || lower.includes('run') || lower.includes('workout')) genre = 'Sport';
  else if (lower.includes('idea') || lower.includes('project')) genre = 'Ideas';
  else if (lower.includes('http') || lower.includes('www')) genre = 'Links';

  return { type: FrameType.NOTE, title: 'Note', summary: 'Using Offline Mock', payload: { content: text }, genre };
};

export class GeminiService {
  private endpoint: string;

  constructor() {
    // defined in .env or .env.local
    // Using simple cast to avoid TS errors in some environments
    const env = (import.meta as any).env;
    this.endpoint = env?.VITE_AI_ENDPOINT || '';
  }

  async routeInput(text: string): Promise<RoutingResult> {
    // 1. If no endpoint configured, immediate mock
    if (!this.endpoint) {
      console.warn("VITE_AI_ENDPOINT is missing. Falling back to mock.");
      // Simulate network delay for realism
      return new Promise(resolve => setTimeout(() => resolve(mockRoute(text)), 600));
    }

    try {
      // 2. Call Cloud Run Backend
      const response = await fetch(`${this.endpoint}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const result = await response.json();

      // 3. Sanitize/Validate Return
      // Ensures the frontend doesn't crash if backend sends partial data
      return {
        type: (result.type as FrameType) || FrameType.NOTE,
        title: result.title || "Untitled",
        summary: result.summary || "Processed",
        genre: result.genre || "General",
        payload: result.payload || {}
      };

    } catch (error) {
      console.error("Backend routing failed:", error);
      // 4. Network/Server Failure Fallback
      return mockRoute(text);
    }
  }
}

export const geminiService = new GeminiService();