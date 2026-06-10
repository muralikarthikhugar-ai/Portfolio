import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore, doc, getDoc } from "firebase/firestore";

// @ts-ignore
import firebaseConfig from "../../firebase-applet-config.json";
// @ts-ignore
import rawData from "../../data.json";

// Lazy initialization of Firebase Client SDK
let db: any = null;
function getFirestoreDb() {
  if (db) return db;

  try {
    const clientApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
    
    try {
      db = initializeFirestore(clientApp, {
        experimentalForceLongPolling: true,
      }, dbId);
      console.log(`🔥 Netlify Firebase Web Client initialized database: ${dbId} with long-polling.`);
    } catch (e) {
      db = getFirestore(clientApp, dbId);
      console.log(`🔥 Netlify Firebase Web Client acquired existing database: ${dbId}`);
    }
  } catch (error: any) {
    console.error("⚠️ Failed to initialize Firebase in chat function:", error.message);
  }
  return db;
}

// Fetch helper to fetch content data from Firestore or local fallback
async function getPortfolioData(): Promise<any> {
  const firestoreDb = getFirestoreDb();
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, "content", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          const { writeSecret, ...safeData } = data;
          return safeData;
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Failed to read Firestore, falling back to local file...", err.message);
    }
  }

  const { writeSecret, ...safeParsed } = rawData as any;
  return safeParsed;
}

// Dynamically generate System Persona instructions based on Firestore/data.json
async function getSystemInstruction() {
  try {
    const data = await getPortfolioData();

    // Build the projects string
    const projectsString = (data.projectsData || []).map((p: any) => 
      `   - ${p.title} - ${p.tagline}: ${(p.description || []).join(" ")} (${(p.techStack || []).join(", ")})`
    ).join("\n");

    // Build the certs string
    const certsString = (data.certificationsData || []).map((c: any) => 
      `   - ${c.title} with ${c.issuer}: Verified via ${c.credentialCode}. Skills gained: ${(c.skillsGained || []).join(", ")}`
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
   - Email: ${data.contactData?.email || ""}
   - Phone: ${data.contactData?.phone || ""}
   - GitHub: ${data.contactData?.github || ""}
   - LinkedIn: ${data.contactData?.linkedin || ""}
   - Location: ${data.contactData?.address || ""}
2. Academic Background:
   - Degree: ${data.educationData?.degree || ""}
   - College: ${data.educationData?.college || ""}
   - University Affiliate: ${data.educationData?.university || ""}
   - Current Standing: CGPA of ${data.educationData?.cgpa || ""} - ${data.educationData?.semester || ""}
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

    // Load instructions dynamically from the Firestore/bundled data.json
    const systemInstruction = await getSystemInstruction();

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
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ text: response.text || "I was unable to formulate a response." }),
    };
  } catch (error: any) {
    console.error("Netlify Serverless Function Error:", error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Serverless function execution failure under Netlify chat function.",
        message: error?.message || String(error),
        stack: error?.stack,
      }),
    };
  }
};
