import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import { initializeApp as adminInitializeApp } from "firebase-admin/app";
import { getFirestore as adminGetFirestore } from "firebase-admin/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_do_not_use_in_prod";

// Initialize Firebase Admin dynamically and lazily
let db: FirebaseFirestore.Firestore | null = null;
let initializedFirebaseAdmin = false;

async function getFirestoreDb(): Promise<FirebaseFirestore.Firestore | null> {
  if (initializedFirebaseAdmin) return db;
  initializedFirebaseAdmin = true;
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const configStr = await fs.readFile(configPath, "utf-8");
    const firebaseConfig = JSON.parse(configStr);
    const adminApp = adminInitializeApp({ projectId: firebaseConfig.projectId });
    db = adminGetFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
    console.log("🔥 Firebase Admin initialized successfully.");
  } catch (error) {
    console.log("⚠️ Could not initialize Firebase Admin SDK. Will fallback to data.json. Error:", (error as Error).message);
  }
  return db;
}

// Helper to get or seed data
async function getPortfolioData() {
  const firestoreDb = await getFirestoreDb();
  try {
    if (firestoreDb) {
      const docRef = firestoreDb.collection("content").doc("main");
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return docSnap.data();
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to read from Firestore DB, falling back to local file...", err);
  }
  
  // Fallback to reading data.json (or initial seed)
  const dataPath = path.join(process.cwd(), "data.json");
  const fileContent = await fs.readFile(dataPath, "utf-8");
  const parsedData = JSON.parse(fileContent);

  // If DB is available but didn't have data, seed it for next time
  if (firestoreDb) {
    try {
      await firestoreDb.collection("content").doc("main").set(parsedData);
      console.log("🌱 Successfully seeded Firestore with initial data.json");
    } catch (err) {
      console.error("⚠️ Failed to seed Firestore: ", err);
    }
  }

  return parsedData;
}

// Authentication Middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized access: No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized access: Invalid or expired token" });
  }
};

// API for CMS: Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials", success: false });
  }
});

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

// Dynamically generate System Persona instructions based on Firestore/data.json
async function getSystemInstruction() {
  try {
    const data = await getPortfolioData();

    // Build the projects string
    const projectsString = data.projectsData.map((p: any) => 
      `   - ${p.title} - ${p.tagline}: ${p.description.join(" ")} (${p.techStack.join(", ")})`
    ).join("\n");

    // Build the certs string
    const certsString = data.certificationsData.map((c: any) => 
      `   - ${c.title} with ${c.issuer}: Verified via ${c.credentialCode}. Skills gained: ${c.skillsGained.join(", ")}`
    ).join("\n");

    // Attempt to read unstructured data from payload
    const unstructuredKnowledge = data.unstructuredKnowledge || "";

    return `
You are the AI Twin of Murali Karthik, a highly skilled and enthusiastic software developer, machine learning enthusiast, and cybersecurity specialist.
Always reply in first-person as Murali's AI Twin.
Your tone is professional, technical, helpful, and highly motivated. Keep responses concise but visually clean, using bullet points or clean markdown where appropriate.
If asked general programming or computer science questions, relate them back to your technical stack or projects where possible.

Here are your verified credentials, certifications, and project records:
1. Contact Details:
   - Email: ${data.contactData.email}
   - Phone: ${data.contactData.phone}
   - GitHub: ${data.contactData.github}
   - LinkedIn: ${data.contactData.linkedin}
   - Location: ${data.contactData.address}
2. Academic Background:
   - Degree: ${data.educationData.degree}
   - College: ${data.educationData.college}
   - University Affiliate: ${data.educationData.university}
   - Current Standing: CGPA of ${data.educationData.cgpa} - ${data.educationData.semester}
3. Industry Simulation Certifications:
${certsString}
4. Key Projects:
${projectsString}

Additional Knowledge Base (from data.txt):
${unstructuredKnowledge}
`;
  } catch (error) {
    console.error("Failed to read data for system instruction", error);
    return "You are the AI Twin of Murali Karthik."; // Fallback
  }
}

// API for CMS: Get content
app.get("/api/content", async (req, res) => {
  try {
    const data = await getPortfolioData();
    if (data) {
      const { writeSecret, ...safeData } = data;
      res.json(safeData);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error("Error reading data", error);
    res.status(500).json({ error: "Failed to read data" });
  }
});

// API for CMS: Update content
app.put("/api/content", requireAuth, async (req, res) => {
  try {
    const payload = req.body;
    const firestoreDb = await getFirestoreDb();
    
    // Attempt saving to Firestore if available
    if (firestoreDb) {
      await firestoreDb.collection("content").doc("main").set(payload);
    } else {
      // Fallback
      const dataPath = path.join(process.cwd(), "data.json");
      await fs.writeFile(dataPath, JSON.stringify(payload, null, 2), "utf-8");
    }

    // Always keep data.txt synchronized with unstructuredKnowledge for dual persistence/integrity
    if (typeof payload.unstructuredKnowledge === "string") {
      const txtPath = path.join(process.cwd(), "data.txt");
      await fs.writeFile(txtPath, payload.unstructuredKnowledge, "utf-8");
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error writing data", error);
    res.status(500).json({ error: "Failed to write data" });
  }
});

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
    const systemInstruction = await getSystemInstruction();

    // Format thread history for context if provided, or perform a direct single query with rich system instructions
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
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
