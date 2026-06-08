import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
