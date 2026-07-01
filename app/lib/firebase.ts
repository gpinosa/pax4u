/**
 * lib/firebase.ts — Configuración del cliente Firebase
 *
 * Usado en componentes del lado del cliente ("use client").
 * Las variables NEXT_PUBLIC_* son accesibles en el navegador.
 *
 * Exporta:
 * - app: instancia de Firebase
 * - auth: Firebase Authentication
 * - db: Firestore Database
 * - googleProvider: proveedor de Google para el login
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ─── Configuración del proyecto Pax4u ────────────────────────────────────────
// Estas variables vienen del archivo .env.local
// NUNCA pongas los valores directamente aquí — usa siempre .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar Firebase más de una vez (importante en Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Servicios de Firebase que usamos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;