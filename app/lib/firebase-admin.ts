/**
 * lib/firebase-admin.ts — Configuración de Firebase Admin (servidor)
 *
 * Usado SOLO en Server Components y API Routes (no en el cliente).
 * Permite verificar tokens de sesión y acceder a Firestore con
 * permisos de administrador, sin pasar por las reglas de seguridad.
 *
 * Las credenciales vienen del JSON descargado en Firebase Console
 * → Configuración → Cuentas de servicio → Generar nueva clave privada
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ─── Inicialización única del SDK de Admin ───────────────────────────────────
let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // La clave privada viene con \n literales en el .env — hay que reemplazarlos
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = getApps()[0];
}

// Servicios de Admin
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

export default adminApp;