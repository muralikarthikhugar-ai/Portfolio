import { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { initializeApp as adminInitializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore as adminGetFirestore } from "firebase-admin/firestore";

// Helper to search for and read files in serverless environment
async function findAndReadFile(filename: string): Promise<string | null> {
  const possiblePaths = [
    path.join(process.cwd(), filename),
    path.join(__dirname, filename),
    path.join(__dirname, "..", filename),
    path.join(__dirname, "..", "..", filename),
    path.join(__dirname, "..", "..", "..", filename),
  ];

  for (const p of possiblePaths) {
    try {
      const content = await fs.readFile(p, "utf-8");
      if (content && content.trim()) {
        return content.trim();
      }
    } catch {
      // Keep looking
    }
  }
  return null;
}

// Lazy initialization of Firebase Admin
let db: any = null;
async function getFirestoreDb() {
  if (db) return db;

  try {
    const configStr = await findAndReadFile("firebase-applet-config.json");
    if (!configStr) {
      console.warn("⚠️ No firebase-applet-config.json found for Netlify content function.");
      return null;
    }

    const firebaseConfig = JSON.parse(configStr);
    
    let adminApp;
    if (getApps().length === 0) {
      adminApp = adminInitializeApp({ projectId: firebaseConfig.projectId });
    } else {
      adminApp = getApp();
    }
    
    db = adminGetFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
    console.log("🔥 Netlify Firebase Admin initialized successfully.");
  } catch (error: any) {
    console.error("⚠️ Failed to initialize Firebase Admin in content function:", error.message);
  }
  return db;
}

// Fetch helper to fetch content data from Firestore or local fallback
async function getPortfolioData(): Promise<any> {
  const firestoreDb = await getFirestoreDb();
  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("content").doc("main");
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return docSnap.data();
      }
    } catch (err) {
      console.warn("⚠️ Failed to read Firestore, falling back to local file...", err);
    }
  }

  // Local fallback
  const fallbackJsonStr = await findAndReadFile("data.json");
  if (fallbackJsonStr) {
    const parsed = JSON.parse(fallbackJsonStr);
    // If Firestore is working but main document is empty, seed it
    if (firestoreDb) {
      try {
        await firestoreDb.collection("content").doc("main").set(parsed);
        console.log("🌱 Successfully seeded Firestore on Netlify with initial data.json");
      } catch (err) {
        console.error("⚠️ Failed to seed Firestore on Netlify:", err);
      }
    }
    return parsed;
  }

  throw new Error("Could not load portfolio data from Firestore or local fallback");
}

export const handler: Handler = async (event, context) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_do_not_use_in_prod";

  // --- GET METHOD ---
  if (event.httpMethod === "GET") {
    try {
      const data = await getPortfolioData();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  // --- PUT METHOD (Save modifications) ---
  if (event.httpMethod === "PUT") {
    // Authenticate administrative session
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Unauthorized access: No token provided" }),
      };
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Unauthorized access: Invalid or expired token" }),
      };
    }

    try {
      const payload = JSON.parse(event.body || "{}");
      const firestoreDb = await getFirestoreDb();

      if (firestoreDb) {
        await firestoreDb.collection("content").doc("main").set(payload);
      } else {
        // Fallback local write (might be read-only/transient on Netlify but lets have it)
        const targetPaths = [
          path.join(process.cwd(), "data.json"),
          path.join(__dirname, "data.json"),
        ];
        for (const p of targetPaths) {
          try {
            await fs.writeFile(p, JSON.stringify(payload, null, 2), "utf-8");
          } catch {
            // ignore filesystem writes if read-only
          }
        }
      }

      // Synchronize data.txt file dynamically if payload exists
      if (typeof payload.unstructuredKnowledge === "string") {
        const targetPaths = [
          path.join(process.cwd(), "data.txt"),
          path.join(__dirname, "data.txt"),
        ];
        for (const p of targetPaths) {
          try {
            await fs.writeFile(p, payload.unstructuredKnowledge, "utf-8");
          } catch {
            // ignore filesystem writes if read-only
          }
        }
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to write data", details: error.message }),
      };
    }
  }

  // Unsupported methods
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
