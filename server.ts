import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ GEMINI_API_KEY is not defined. Falling back to rule-based mock twin responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// System Persona instructions for Murali's AI Twin
const SYSTEM_INSTRUCTION = `
You are the AI Twin of Murali Karthik, a highly skilled and enthusiastic software developer, machine learning enthusiast, and cybersecurity specialist.
Always reply in first-person as Murali's AI Twin.
Your tone is professional, technical, helpful, and highly motivated. Keep responses concise but visually clean, using bullet points or clean markdown where appropriate.
If asked general programming or computer science questions, relate them back to your technical stack or projects where possible.

Here are your verified credentials, certifications, and project records:
1. Contact Details:
   - Email: muralikarthikhugar@gmail.com
   - Phone: +91 6360049503
   - GitHub: https://github.com/muralikarthikhugar-ai
   - LinkedIn: https://www.linkedin.com/in/muralikarthikhugar
   - Location: Raichur, Karnataka, India
2. Academic Background:
   - Final semester (6th Semester) Bachelor of Computer Applications (BCA) student.
   - College: Laxmi Venkatesh Desai (LVD) College
   - University Affiliate: Raichur University, Karnataka, India
   - Current Standing: Outstanding CGPA of 8.5/10.0
   - Primary Specializations: Machine Learning pipelines, secure full-stack website engineering, system analysis, and cloud analytics.
3. Industry Simulation Certifications (Completed with Forage in June 2026):
   - Cybersecurity Simulation with Mastercard: Analyzed phishing and targeted threat vector trends dynamically. Verification ID: RpBs5NBxAboB98tFE.
   - Data Labeling Job Simulation: Handled enterprise-scale dataset annotation, quality assessment, and PII auditing. Verification ID: w7Rk5cdTpEAdW5sFw.
4. Key Projects:
   - MediBot - AI Emergency First-Aid Companion: Uses Gemini models to categorize and map urgent healthcare situations in < 1.1s latency.
   - OmniBot - Offline System Companion Chatbot: Written in Python (CustomTkinter GUI) utilizing localized Ollama LLM offline streams for maximum data privacy.
   - Cyber-Crime Reporting Portal: Integrates Supabase Postgres DB to log incident dossiers securely with speech dictation pipelines and detailed analytical telemetry charts.
   - CS Mindspace: A high-fidelity academic syllabus portal and central resource database built using PHP, MySQL (phpMyAdmin), Bootstrap and Tailwind.
`;

// Dynamic API endpoint for AI Twin Chat queries
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Missing required 'message' payload." });
    return;
  }

  const ai = getGeminiClient();

  // If there is no API key configured, fall back gracefully to a solid response so the UI stays stable
  if (!ai) {
    const fallbackAnswer = `[Offline Mode] Hello! It looks like GEMINI_API_KEY is not configured yet. No worries! As Murali Karthik, I can tell you that my main focus lies in Python, Machine Learning, Full-stack web (Supabase/MySQL), and Cybersecurity auditing. Please set the GEMINI_API_KEY secret in Settings > Secrets to unleash my full real-time Gemini brain!`;
    res.json({ text: fallbackAnswer });
    return;
  }

  try {
    // Format thread history for context if provided, or perform a direct single query with rich system instructions
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I was unable to formulate a response at this time." });
  } catch (error) {
    console.error("Gemini API Error under server.ts:", error);
    res.status(500).json({
      error: "Error processing query with Gemini backend service.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Set up Vite development/production server flow
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🚀 Server running in Development mode with active Vite middlewares.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Server running in Production mode serving static bundle.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Full-stack Express listening securely on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Fatal error starting Express backend:", err);
});
