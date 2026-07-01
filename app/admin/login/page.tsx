"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/app/lib/firebase";

export default function PaginaLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "no-autorizado") {
      setError("Tu cuenta no tiene permisos de administrador.");
    }
  }, [searchParams]);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/admin");
    });
    return () => cancelar();
  }, [router]);

  async function manejarLoginEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const codigo = (err as { code?: string })?.code;
      if (codigo === "auth/invalid-credential" || codigo === "auth/wrong-password") {
        setError("Email o contraseña incorrectos.");
      } else if (codigo === "auth/user-not-found") {
        setError("No existe ninguna cuenta con ese email.");
      } else if (codigo === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function manejarLoginGoogle() {
    setError("");
    setCargando(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/admin");
    } catch (err: unknown) {
      const codigo = (err as { code?: string })?.code;
      if (codigo !== "auth/popup-closed-by-user") {
        setError("Error al iniciar sesión con Google.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111111",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
          <span style={{ color: "#111" }}>PA</span>
          <span style={{ color: "#F7C600" }}>X</span>
          <span style={{ color: "#111" }}>4U</span>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginTop: "-0.5rem" }}>
          Panel de Administración
        </p>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(226,75,74,0.08)", border: "1.5px solid rgba(226,75,74,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#A32D2D" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Botón Google */}
        <button
          type="button"
          onClick={manejarLoginGoogle}
          disabled={cargando}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "10px", background: "#fff", fontSize: "0.9rem", fontWeight: 600, color: "#111", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Separador */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#bbb", fontSize: "0.8rem" }}>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          <span>o con email y contraseña</span>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
        </div>

        {/* Formulario */}
        <form onSubmit={manejarLoginEmail} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pax4u.com"
              autoComplete="email"
              required
              style={{ padding: "0.75rem 1rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.95rem", color: "#111", outline: "none", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111" }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={{ padding: "0.75rem 1rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.95rem", color: "#111", outline: "none", width: "100%" }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{ width: "100%", background: "#111", color: "#F7C600", fontSize: "0.95rem", fontWeight: 800, padding: "0.85rem", borderRadius: "10px", border: "none", cursor: "pointer", marginTop: "0.25rem" }}
          >
            {cargando ? "Entrando..." : "Entrar al panel →"}
          </button>
        </form>

        <a href="/" style={{ textAlign: "center", fontSize: "0.8rem", color: "#aaa", textDecoration: "underline", marginTop: "0.5rem" }}>
          ← Volver a la web
        </a>
      </div>
    </div>
  );
}