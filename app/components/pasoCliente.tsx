"use client";

/**
 * Paso4Cliente — Paso 4 del wizard de reserva
 *
 * Recoge los datos personales del cliente para la reserva:
 * - Nombre completo
 * - Email (se enviará la confirmación aquí)
 * - Teléfono (para coordinación con el conductor)
 * - Comentarios opcionales (vuelo, necesidades especiales, etc.)
 *
 * Validaciones:
 * - Nombre: obligatorio, mín. 2 caracteres
 * - Email: obligatorio, formato válido
 * - Teléfono: obligatorio, solo números y + (internacional)
 * - Comentarios: opcional
 *
 * Props:
 * - datos: valores actuales (o null si es la primera vez)
 * - onGuardar: callback con los datos validados
 * - onAtras: callback para volver al paso anterior
 */

import { useState } from "react";
import { DatosCliente } from "./tipoReserva";

interface Props {
  datos: DatosCliente | null;
  onGuardar: (datos: DatosCliente) => void;
  onAtras: () => void;
}

// Expresión regular para validar email
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Expresión regular para teléfono: permite +, espacios y números
const REGEX_TELEFONO = /^[+\d\s\-()]{6,20}$/;

export default function Paso4Cliente({ datos, onGuardar, onAtras }: Props) {
  // ─── Estado local del formulario ──────────────────────────────────────────
  const [nombre, setNombre] = useState(datos?.nombre ?? "");
  const [email, setEmail] = useState(datos?.email ?? "");
  const [telefono, setTelefono] = useState(datos?.telefono ?? "");
  const [comentarios, setComentarios] = useState(datos?.comentarios ?? "");
  const [errores, setErrores] = useState<Partial<Record<keyof DatosCliente, string>>>({});

  // ─── Validación ───────────────────────────────────────────────────────────
  function validar(): boolean {
    const nuevosErrores: Partial<Record<keyof DatosCliente, string>> = {};

    if (nombre.trim().length < 2)
      nuevosErrores.nombre = "Introduce tu nombre completo.";

    if (!REGEX_EMAIL.test(email))
      nuevosErrores.email = "El email no tiene un formato válido.";

    if (!REGEX_TELEFONO.test(telefono))
      nuevosErrores.telefono = "Introduce un teléfono válido (ej: +34 612 345 678).";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  // ─── Envío ────────────────────────────────────────────────────────────────
  function manejarEnvio() {
    if (!validar()) return;
    onGuardar({ nombre, email, telefono, comentarios });
  }

  return (
    <div className="paso-wizard">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="paso-wizard__cabecera">
        <h2 className="paso-wizard__titulo">Tus datos</h2>
        <p className="paso-wizard__subtitulo">
          Te enviaremos la confirmación por email y el conductor podrá
          contactarte si es necesario.
        </p>
      </div>

      {/* ── Formulario de cliente ────────────────────────────────── */}
      <div className="formulario">

        {/* Nombre completo */}
        <div className="campo">
          <label htmlFor="nombre" className="campo__etiqueta">
            Nombre completo <span className="campo__requerido">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María García López"
            autoComplete="name"
            className={`campo__input ${errores.nombre ? "campo__input--error" : ""}`}
          />
          {errores.nombre && (
            <p className="campo__error">{errores.nombre}</p>
          )}
        </div>

        {/* Email */}
        <div className="campo">
          <label htmlFor="email" className="campo__etiqueta">
            Email <span className="campo__requerido">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            className={`campo__input ${errores.email ? "campo__input--error" : ""}`}
          />
          {errores.email && (
            <p className="campo__error">{errores.email}</p>
          )}
          <p className="campo__ayuda">
            Aquí recibirás la confirmación de tu reserva.
          </p>
        </div>

        {/* Teléfono */}
        <div className="campo">
          <label htmlFor="telefono" className="campo__etiqueta">
            Teléfono <span className="campo__requerido">*</span>
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+34 612 345 678"
            autoComplete="tel"
            className={`campo__input ${errores.telefono ? "campo__input--error" : ""}`}
          />
          {errores.telefono && (
            <p className="campo__error">{errores.telefono}</p>
          )}
          <p className="campo__ayuda">
            El conductor te contactará aquí si hay alguna incidencia.
          </p>
        </div>

        {/* Comentarios (opcional) */}
        <div className="campo">
          <label htmlFor="comentarios" className="campo__etiqueta">
            Comentarios o peticiones especiales{" "}
            <span className="campo__opcional">(opcional)</span>
          </label>
          <textarea
            id="comentarios"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Ej: Número de vuelo IB3456, necesito silla para bebé, llegaré tarde..."
            rows={3}
            className="campo__textarea"
          />
        </div>

      </div>

      {/* ── Aviso de privacidad ──────────────────────────────────── */}
      <p className="paso4__privacidad">
        🔒 Tus datos están protegidos. Solo se usan para gestionar tu reserva.{" "}
        <a href="/privacidad" className="paso4__privacidad-link">
          Ver política de privacidad
        </a>
      </p>

      {/* ── Acciones ─────────────────────────────────────────────── */}
      <div className="paso-wizard__acciones paso-wizard__acciones--doble">
        <button type="button" onClick={onAtras} className="boton-atras">
          ← Atrás
        </button>
        <button type="button" onClick={manejarEnvio} className="boton-siguiente">
          Siguiente →
        </button>
      </div>

    </div>
  );
}