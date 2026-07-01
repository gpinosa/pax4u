"use client";

/**
 * pasoServicio.tsx — Paso 1 del wizard de reserva
 *
 * Fix móvil: las tarjetas usan onTouchEnd además de onClick
 * para garantizar que el evento se dispara en iOS/Android.
 */

import { SlugServicio } from "./tipoReserva";

// ─── Servicios disponibles ────────────────────────────────────────────────────
const OPCIONES_SERVICIO = [
  { slug: "aeropuerto-privado" as SlugServicio, icono: "✈️", titulo: "Private Airport Transfer", tituloEs: "Transfer Privado al Aeropuerto" },
  { slug: "aeropuerto-barcelona" as SlugServicio, icono: "🛬", titulo: "Barcelona Airport Transfer", tituloEs: "Transfer Aeropuerto Barcelona" },
  { slug: "taxi-privado" as SlugServicio, icono: "🚖", titulo: "Private Taxi Barcelona", tituloEs: "Taxi Privado en Barcelona" },
  { slug: "tours" as SlugServicio, icono: "🗺️", titulo: "Barcelona Tours", tituloEs: "Tours Privados por Barcelona" },
  { slug: "crucero" as SlugServicio, icono: "🚢", titulo: "Cruise Port Transfer", tituloEs: "Transfer Puerto de Cruceros" },
  { slug: "hotel" as SlugServicio, icono: "🏨", titulo: "Hotel Transfer", tituloEs: "Transfer al Hotel" },
  { slug: "conductor-privado" as SlugServicio, icono: "🚗", titulo: "Private Driver Service", tituloEs: "Servicio de Conductor Privado" },
];

interface Props {
  seleccion: SlugServicio | null;
  onSeleccionar: (slug: SlugServicio) => void;
  onSiguiente: () => void;
}

export default function Paso1Servicio({ seleccion, onSeleccionar, onSiguiente }: Props) {

  // Manejador unificado para click y touch
  function manejarSeleccion(e: React.MouseEvent | React.TouchEvent, slug: SlugServicio) {
    e.preventDefault();
    e.stopPropagation();
    onSeleccionar(slug);
  }

  function manejarSiguiente(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (seleccion) onSiguiente();
  }

  return (
    <div className="paso-wizard">

      <div className="paso-wizard__cabecera">
        <h2 className="paso-wizard__titulo">¿Qué servicio necesitas?</h2>
        <p className="paso-wizard__subtitulo">
          Selecciona el tipo de transfer o tour que quieres reservar.
        </p>
      </div>

      <div className="paso1__grid">
        {OPCIONES_SERVICIO.map((opcion) => {
          const estaSeleccionado = seleccion === opcion.slug;

          return (
            <div
              key={opcion.slug}
              role="button"
              tabIndex={0}
              onClick={(e) => manejarSeleccion(e, opcion.slug)}
              onTouchEnd={(e) => manejarSeleccion(e, opcion.slug)}
              onKeyDown={(e) => e.key === "Enter" && onSeleccionar(opcion.slug)}
              className={`paso1__opcion ${estaSeleccionado ? "paso1__opcion--activa" : ""}`}
              aria-pressed={estaSeleccionado}
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              {estaSeleccionado && (
                <span className="paso1__check" aria-hidden="true">✓</span>
              )}
              <span className="paso1__opcion-icono" aria-hidden="true">
                {opcion.icono}
              </span>
              <span className="paso1__opcion-titulo">{opcion.titulo}</span>
              <span className="paso1__opcion-subtitulo">{opcion.tituloEs}</span>
            </div>
          );
        })}
      </div>

      <div className="paso-wizard__acciones">
        <div
          role="button"
          tabIndex={seleccion ? 0 : -1}
          onClick={manejarSiguiente}
          onTouchEnd={manejarSiguiente}
          className="boton-siguiente"
          aria-disabled={!seleccion}
          style={{
            opacity: seleccion ? 1 : 0.45,
            cursor: seleccion ? "pointer" : "not-allowed",
            pointerEvents: "all",
            userSelect: "none",
            WebkitUserSelect: "none",
            textAlign: "center",
          }}
        >
          Siguiente →
        </div>
      </div>

    </div>
  );
}