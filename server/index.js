import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

// Middleware
// Allow all origins for demo purposes
app.use(cors({ origin: '*' })); 
app.use(express.json());

// Initialize Gemini
// Cloud Run injects GEMINI_API_KEY from environment variables
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set. AI routes will fail.");
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Route: AI Processing
app.post('/route', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  if (!ai) {
    console.error("Attempted to route without API Key configured.");
    return res.status(500).json({ error: "Server AI configuration missing" });
  }

  try {
    const prompt = `
      You are the routing brain of Doorna (an iPhone OS-like web app). 
      Analyze the user input and classify it.

      Input: "${text}"

      Rules:
      1. Classify into ONE FrameType: TODAY, CALENDAR, REMINDER, NOTE, FINANCE, KEY.
      2. If NOTE, assign a "genre" (e.g., Food, Sport, Ideas, Work, Personal).
      3. Create a short "title" (max 5 words).
      4. Create a "summary" (short confirmation, e.g. "Added to list").
      5. Extract "payload" data relevant to the type (e.g. date, time, amount, location).

      Output JSON format only:
      {
        "type": "FRAME_ENUM_VALUE",
        "title": "String",
        "summary": "String",
        "genre": "String (optional)",
        "payload": {} 
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    // Extract text directly from property (Gemini 2.5 SDK style)
    const jsonStr = response.text; 
    let result;

    try {
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Parse Error:", jsonStr);
      throw new Error("Invalid JSON from AI");
    }

    // Sanitize/Validate Response
    const sanitized = {
      type: result.type || 'NOTE',
      title: result.title || 'New Item',
      summary: result.summary || 'Saved',
      genre: result.genre || 'General',
      payload: result.payload || {}
    };

    return res.json(sanitized);

  } catch (error) {
    console.error("AI Processing Error:", error);
    return res.status(500).json({ error: "AI_ROUTE_FAILED" });
  }
});

// Cloud Run requires listening on process.env.PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});