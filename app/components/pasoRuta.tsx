"use client";

/**
 * Paso2Ruta — Paso 2 del wizard de reserva
 *
 * Recoge los detalles del trayecto:
 * - Origen (pickup location)
 * - Destino (drop-off location)
 * - Fecha y hora de recogida
 * - Número de pasajeros
 * - Número de maletas
 *
 * Validaciones:
 * - Todos los campos son obligatorios
 * - La fecha no puede ser en el pasado
 * - Pasajeros: mín. 1, máx. 8
 * - Maletas: mín. 0, máx. 10
 *
 * En Fase 2: origen y destino se conectarán con Google Places Autocomplete.
 *
 * Props:
 * - datos: valores actuales del formulario (o null si es la primera vez)
 * - onGuardar: callback con los datos validados para avanzar
 * - onAtras: callback para volver al paso anterior
 */

import { useState } from "react";
import { DetallesRuta } from "./tipoReserva";

interface Props {
  datos: DetallesRuta | null;
  onGuardar: (datos: DetallesRuta) => void;
  onAtras: () => void;
}

// Fecha mínima: hoy (no se puede reservar en el pasado)
function obtenerFechaMinima(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Paso2Ruta({ datos, onGuardar, onAtras }: Props) {
  // ─── Estado local del formulario ──────────────────────────────────────────
  const [origen, setOrigen] = useState(datos?.origen ?? "");
  const [destino, setDestino] = useState(datos?.destino ?? "");
  const [fecha, setFecha] = useState(datos?.fecha ?? "");
  const [hora, setHora] = useState(datos?.hora ?? "");
  const [pasajeros, setPasajeros] = useState(datos?.pasajeros ?? 1);
  const [maletas, setMaletas] = useState(datos?.maletas ?? 1);
  const [errores, setErrores] = useState<Partial<Record<keyof DetallesRuta, string>>>({});

  // ─── Validación del formulario ────────────────────────────────────────────
  function validar(): boolean {
    const nuevosErrores: Partial<Record<keyof DetallesRuta, string>> = {};

    if (!origen.trim()) nuevosErrores.origen = "Indica el lugar de recogida.";
    if (!destino.trim()) nuevosErrores.destino = "Indica el destino.";
    if (!fecha) nuevosErrores.fecha = "Selecciona una fecha.";
    if (!hora) nuevosErrores.hora = "Selecciona la hora de recogida.";
    if (pasajeros < 1 || pasajeros > 8)
      nuevosErrores.pasajeros = "Entre 1 y 8 pasajeros.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  // ─── Envío del formulario ─────────────────────────────────────────────────
  function manejarEnvio() {
    if (!validar()) return;
    onGuardar({ origen, destino, fecha, hora, pasajeros, maletas });
  }

  return (
    <div className="paso-wizard">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="paso-wizard__cabecera">
        <h2 className="paso-wizard__titulo">Detalles del trayecto</h2>
        <p className="paso-wizard__subtitulo">
          Dinos de dónde sales, a dónde vas y cuándo.
        </p>
      </div>

      {/* ── Formulario de ruta ───────────────────────────────────── */}
      <div className="formulario">

        {/* Origen */}
        <div className="campo">
          <label htmlFor="origen" className="campo__etiqueta">
            Lugar de recogida <span className="campo__requerido">*</span>
          </label>
          {/*
           * TODO Fase 2: reemplazar este input por un componente
           * con Google Places Autocomplete para sugerencias en tiempo real
           */}
          <input
            id="origen"
            type="text"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            placeholder="Ej: Aeropuerto El Prat, Terminal 1"
            className={`campo__input ${errores.origen ? "campo__input--error" : ""}`}
          />
          {errores.origen && (
            <p className="campo__error">{errores.origen}</p>
          )}
        </div>

        {/* Destino */}
        <div className="campo">
          <label htmlFor="destino" className="campo__etiqueta">
            Destino <span className="campo__requerido">*</span>
          </label>
          <input
            id="destino"
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ej: Hotel Arts, Barcelona"
            className={`campo__input ${errores.destino ? "campo__input--error" : ""}`}
          />
          {errores.destino && (
            <p className="campo__error">{errores.destino}</p>
          )}
        </div>

        {/* Fecha y Hora en la misma fila */}
        <div className="formulario__fila">
          <div className="campo">
            <label htmlFor="fecha" className="campo__etiqueta">
              Fecha <span className="campo__requerido">*</span>
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              min={obtenerFechaMinima()}
              onChange={(e) => setFecha(e.target.value)}
              className={`campo__input ${errores.fecha ? "campo__input--error" : ""}`}
            />
            {errores.fecha && (
              <p className="campo__error">{errores.fecha}</p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="hora" className="campo__etiqueta">
              Hora de recogida <span className="campo__requerido">*</span>
            </label>
            <input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className={`campo__input ${errores.hora ? "campo__input--error" : ""}`}
            />
            {errores.hora && (
              <p className="campo__error">{errores.hora}</p>
            )}
          </div>
        </div>

        {/* Pasajeros y Maletas en la misma fila */}
        <div className="formulario__fila">
          <div className="campo">
            <label htmlFor="pasajeros" className="campo__etiqueta">
              Pasajeros <span className="campo__requerido">*</span>
            </label>
            {/* Selector con botones +/- para mejor UX en móvil */}
            <div className="contador">
              <button
                type="button"
                onClick={() => setPasajeros(Math.max(1, pasajeros - 1))}
                className="contador__boton"
                aria-label="Reducir pasajeros"
              >
                −
              </button>
              <span className="contador__valor">{pasajeros}</span>
              <button
                type="button"
                onClick={() => setPasajeros(Math.min(8, pasajeros + 1))}
                className="contador__boton"
                aria-label="Aumentar pasajeros"
              >
                +
              </button>
            </div>
            {errores.pasajeros && (
              <p className="campo__error">{errores.pasajeros}</p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="maletas" className="campo__etiqueta">
              Maletas grandes
            </label>
            <div className="contador">
              <button
                type="button"
                onClick={() => setMaletas(Math.max(0, maletas - 1))}
                className="contador__boton"
                aria-label="Reducir maletas"
              >
                −
              </button>
              <span className="contador__valor">{maletas}</span>
              <button
                type="button"
                onClick={() => setMaletas(Math.min(10, maletas + 1))}
                className="contador__boton"
                aria-label="Aumentar maletas"
              >
                +
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Acciones del paso ────────────────────────────────────── */}
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