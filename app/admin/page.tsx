"use client";

/**
 * app/admin/login/page.tsx — Pantalla de login del panel admin
 *
 * Dos métodos de acceso:
 * 1. Email + contraseña (Firebase Authentication)
 * 2. Google (OAuth)
 *
 * Tras el login exitoso → redirige a /admin (dashboard)
 * Si el email no está en ADMINS_PERMITIDOS → muestra error
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function PaginaLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Mensaje de error si viene de un redirect por no autorizado
  useEffect(() => {
    if (searchParams.get("error") === "no-autorizado") {
      setError("Tu cuenta no tiene permisos de administrador.");
    }
  }, [searchParams]);

  // Si ya hay sesión activa → redirigir al panel
  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/admin");
    });
    return () => cancelar();
  }, [router]);

  // ─── Login con email y contraseña ────────────────────────────────────────
  async function manejarLoginEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      // Mensajes de error en español
      const codigo = (err as { code?: string })?.code;
      if (codigo === "auth/invalid-credential" || codigo === "auth/wrong-password") {
        setError("Email o contraseña incorrectos.");
      } else if (codigo === "auth/user-not-found") {
        setError("No existe ninguna cuenta con ese email.");
      } else if (codigo === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos e inténtalo de nuevo.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  // ─── Login con Google ─────────────────────────────────────────────────────
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
    <div className="login-pagina">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__pax">PA</span>
          <span className="login-logo__x">X</span>
          <span className="login-logo__pax">4U</span>
        </div>
        <p className="login-subtitulo">Panel de Administración</p>

        {/* Error global */}
        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        {/* Botón de Google */}
        <button
          type="button"
          onClick={manejarLoginGoogle}
          disabled={cargando}
          className="login-btn-google"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Separador */}
        <div className="login-separador">
          <span>o con email y contraseña</span>
        </div>

        {/* Formulario email/password */}
        <form onSubmit={manejarLoginEmail} className="login-form">
          <div className="campo">
            <label htmlFor="login-email" className="campo__etiqueta">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pax4u.com"
              autoComplete="email"
              required
              className="campo__input"
            />
          </div>

          <div className="campo">
            <label htmlFor="login-pass" className="campo__etiqueta">
              Contraseña
            </label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="campo__input"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="login-btn-email"
          >
            {cargando ? "Entrando..." : "Entrar al panel →"}
          </button>
        </form>

        {/* Volver a la web */}
        <a href="/" className="login-volver">
          ← Volver a la web
        </a>

      </div>
    </div>
  );
}