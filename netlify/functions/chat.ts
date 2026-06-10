import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs/promises";

// Helper to dynamically resolve and load instructions from data.txt
async function loadSystemInstruction(): Promise<string> {
  const possiblePaths = [
    path.join(process.cwd(), "data.txt"),
    path.join(__dirname, "data.txt"),
    path.join(__dirname, "../data.txt"),
    path.join(__dirname, "../../data.txt"),
    path.join(__dirname, "../../../data.txt"),
  ];

  for (const p of possiblePaths) {
    try {
      const content = await fs.readFile(p, "utf-8");
      if (content && content.trim()) {
        return content.trim();
      }
    } catch {
      // Continue searching
    }
  }

  // Elegant fallback string if netlify bundler has transient file latency
  return "You are the AI Twin of Murali Karthik. Answer in first person as a software developer, machine learning designer, and cybersecurity specialist.";
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests for safe communication
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { message } = body;

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required 'message' payload." }),
      };
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const fallback = `[Netlify Offline Mode] Hello! It looks like GEMINI_API_KEY environment variable is not defined in your Netlify dashboard yet. Please head to Site Settings > Environment Variables in Netlify and specify GEMINI_API_KEY to activate my real-time Gemini mind!`;
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fallback }),
      };
    }

    // Initialize Google Gemini Client with secure environment key
    const ai = new GoogleGenAI({ apiKey: key });

    // Load instructions dynamically from the bundled data.txt
    const systemInstruction = await loadSystemInstruction();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: response.text || "I was unable to formulate a response." }),
    };
  } catch (error) {
    console.error("Netlify Serverless Function Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Serverless function execution failure.",
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
