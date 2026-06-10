import { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// @ts-ignore
import firebaseConfig from "../../firebase-applet-config.json";
// @ts-ignore
import rawData from "../../data.json";

// Lazy initialization of Firebase Client SDK
let db: any = null;
function getFirestoreDb() {
  if (db) return db;

  try {
    // Initialize Web client SDK using the statically built config
    const clientApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    try {
      db = getFirestore(clientApp);
    } catch (e) {
      // Configure with experimental force long polling to prevent WebSocket timeout errors in Lambda execution
      db = initializeFirestore(clientApp, {
        experimentalForceLongPolling: true,
      }, firebaseConfig.firestoreDatabaseId || "(default)");
    }
    console.log("🔥 Netlify Firebase Web Context initialized successfully.");
  } catch (error: any) {
    console.error("⚠️ Failed to initialize Firebase in content function:", error.message);
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

  // Seed Firestore if it is working but empty
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, "content", "main");
      const securePayload = {
        ...rawData,
        writeSecret: "MuraliKarthik_SecureWriteSecret_2026_a8d7e6"
      };
      await setDoc(docRef, securePayload);
      console.log("🌱 Successfully seeded empty Firestore with rawData.");
    } catch (err: any) {
      console.error("⚠️ Failed to seed Firestore on Netlify:", err.message);
    }
  }

  // Direct fallback to statically bundled rawData JSON
  const { writeSecret, ...safeParsed } = rawData as any;
  return safeParsed;
}

export const handler: Handler = async (event, context) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_do_not_use_in_prod";

  // --- GET METHOD ---
  if (event.httpMethod === "GET") {
    try {
      const data = await getPortfolioData();
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify(data),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ 
          error: "Failed to read data via Netlify function", 
          message: error?.message || String(error),
          stack: error?.stack
        }),
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
      const firestoreDb = getFirestoreDb();

      if (firestoreDb) {
        const docRef = doc(firestoreDb, "content", "main");
        const securePayload = {
          ...payload,
          writeSecret: "MuraliKarthik_SecureWriteSecret_2026_a8d7e6"
        };
        await setDoc(docRef, securePayload);
      } else {
        // Fallback local write to serverless runtime directory if Firestore is offline
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
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ success: true }),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ 
          error: "Failed to write data via Netlify function", 
          message: error?.message || String(error),
          stack: error?.stack
        }),
      };
    }
  }

  // Handle preflight options for CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: ""
    };
  }

  // Unsupported methods
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
