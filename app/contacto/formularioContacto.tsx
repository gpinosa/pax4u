"use client";

/**
 * FormularioContacto — Formulario de contacto de Pax4u
 *
 * Campos:
 * - Nombre completo (obligatorio)
 * - Email (obligatorio)
 * - Teléfono (opcional — para responder por WhatsApp)
 * - Asunto: selección entre opciones comunes
 * - Mensaje (obligatorio)
 *
 * Estado del envío:
 * - idle: formulario vacío listo para rellenar
 * - enviando: spinner mientras se procesa
 * - enviado: mensaje de éxito
 * - error: mensaje de error con opción de reintentar
 *
 * TODO Fase 2: reemplazar el setTimeout simulado por una llamada real:
 *
 *   const res = await fetch("/api/contacto", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ nombre, email, telefono, asunto, mensaje }),
 *   });
 *   if (!res.ok) throw new Error("Error al enviar");
 *
 * El endpoint /api/contacto usará Resend o Nodemailer para enviar el email.
 */

import { useState } from "react";

// ─── Opciones del selector de asunto ─────────────────────────────────────────
const ASUNTOS = [
  "Información sobre transfers",
  "Información sobre tours",
  "Cambio o cancelación de reserva",
  "Problema con una reserva",
  "Colaboración / partners",
  "Otro",
];

// ─── Tipos del estado del formulario ─────────────────────────────────────────
type EstadoEnvio = "idle" | "enviando" | "enviado" | "error";

export default function FormularioContacto() {
  // ─── Estado de los campos ────────────────────────────────────────────────
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState(ASUNTOS[0]);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<EstadoEnvio>("idle");

  // ─── Validación ──────────────────────────────────────────────────────────
  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {};

    if (nombre.trim().length < 2)
      nuevosErrores.nombre = "Introduce tu nombre completo.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nuevosErrores.email = "El email no tiene un formato válido.";

    if (mensaje.trim().length < 10)
      nuevosErrores.mensaje = "El mensaje debe tener al menos 10 caracteres.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  // ─── Envío del formulario ────────────────────────────────────────────────
  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setEstado("enviando");

    try {
      /*
       * TODO Fase 2: reemplazar por fetch real a /api/contacto
       * Por ahora simulamos un envío con un delay de 1.5 segundos
       */
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  }

  // ─── Reiniciar formulario ────────────────────────────────────────────────
  function reiniciar() {
    setNombre(""); setEmail(""); setTelefono("");
    setAsunto(ASUNTOS[0]); setMensaje("");
    setErrores({}); setEstado("idle");
  }

  // ─── Pantalla de éxito ───────────────────────────────────────────────────
  if (estado === "enviado") {
    return (
      <div className="contacto-exito">
        <div className="contacto-exito__icono">✓</div>
        <h2 className="contacto-exito__titulo">¡Mensaje enviado!</h2>
        <p className="contacto-exito__texto">
          Hemos recibido tu mensaje y te responderemos en menos de 30 minutos.
          Revisa también tu bandeja de spam por si acaso.
        </p>
        <button onClick={reiniciar} className="boton-amarillo">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  // ─── Formulario ─────────────────────────────────────────────────────────
  return (
    <div className="contacto-form-wrap">
      <h2 className="contacto-form-wrap__titulo">Envíanos un mensaje</h2>
      <p className="contacto-form-wrap__subtitulo">
        Rellena el formulario y te respondemos en menos de 30 minutos.
      </p>

      <form onSubmit={manejarEnvio} className="formulario" noValidate>

        {/* Nombre */}
        <div className="campo">
          <label htmlFor="c-nombre" className="campo__etiqueta">
            Nombre completo <span className="campo__requerido">*</span>
          </label>
          <input
            id="c-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María García"
            autoComplete="name"
            className={`campo__input ${errores.nombre ? "campo__input--error" : ""}`}
          />
          {errores.nombre && <p className="campo__error">{errores.nombre}</p>}
        </div>

        {/* Email y Teléfono en la misma fila */}
        <div className="formulario__fila">
          <div className="campo">
            <label htmlFor="c-email" className="campo__etiqueta">
              Email <span className="campo__requerido">*</span>
            </label>
            <input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              className={`campo__input ${errores.email ? "campo__input--error" : ""}`}
            />
            {errores.email && <p className="campo__error">{errores.email}</p>}
          </div>

          <div className="campo">
            <label htmlFor="c-telefono" className="campo__etiqueta">
              Teléfono{" "}
              <span className="campo__opcional">(opcional)</span>
            </label>
            <input
              id="c-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+34 612 345 678"
              autoComplete="tel"
              className="campo__input"
            />
            <p className="campo__ayuda">Para responderte por WhatsApp.</p>
          </div>
        </div>

        {/* Asunto */}
        <div className="campo">
          <label htmlFor="c-asunto" className="campo__etiqueta">
            Asunto <span className="campo__requerido">*</span>
          </label>
          <select
            id="c-asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="campo__input"
          >
            {ASUNTOS.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        {/* Mensaje */}
        <div className="campo">
          <label htmlFor="c-mensaje" className="campo__etiqueta">
            Mensaje <span className="campo__requerido">*</span>
          </label>
          <textarea
            id="c-mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Cuéntanos en qué podemos ayudarte..."
            rows={5}
            className={`campo__textarea ${errores.mensaje ? "campo__input--error" : ""}`}
          />
          {errores.mensaje && <p className="campo__error">{errores.mensaje}</p>}
        </div>

        {/* Error de envío */}
        {estado === "error" && (
          <div className="contacto-form-error">
            ⚠️ Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo
            de nuevo o contáctanos directamente por WhatsApp.
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="boton-siguiente"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {estado === "enviando" ? "Enviando..." : "Enviar mensaje →"}
        </button>

      </form>
    </div>
  );
}