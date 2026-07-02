import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, writeBatch } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Import patterns directly from the source code
import { PATTERNS } from '../src/data';

// Load .env file
const envPath = resolve(process.cwd(), '.env');
try {
  const envConfig = dotenv.parse(readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} catch (e) {
  console.log("No .env file found or couldn't load it. Using existing env vars if present.");
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("Firebase config is missing from .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  console.log(`Starting migration of ${PATTERNS.length} patterns...`);
  const batch = writeBatch(db);

  for (const pattern of PATTERNS) {
    // 1. Write the pattern
    const patternRef = doc(db, 'patterns', pattern.id);
    const { steps, ...patternData } = pattern;
    batch.set(patternRef, patternData);

    // 2. Write the steps
    if (steps && steps.length > 0) {
      for (const step of steps) {
        const stepId = `${pattern.id}_step_${step.stepNumber}`;
        const stepRef = doc(db, 'pattern_steps', stepId);
        batch.set(stepRef, {
          patternId: pattern.id,
          ...step
        });
      }
    }
  }

  try {
    await batch.commit();
    console.log("✅ Successfully migrated all patterns and steps to Firestore!");
  } catch (error) {
    console.error("❌ Error writing to Firestore:", error);
  }
}

migrateData().catch(console.error);
