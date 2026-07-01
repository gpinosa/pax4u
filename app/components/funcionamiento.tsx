/**
 * ComoFunciona - Sección "Cómo funciona" de la Home
 *
 * Explica el proceso de reserva en 4 pasos visuales y sencillos.
 * Objetivo: eliminar fricción y generar confianza antes de reservar.
 *
 * Los pasos están numerados porque representan una secuencia real
 * que el usuario recorre. El número no es decorativo, es informativo.
 */

// ─── Los 4 pasos del proceso de reserva ──────────────────────────────────────
const pasos = [
  {
    numero: "01",
    titulo: "Elige tu servicio",
    descripcion:
      "Selecciona el tipo de transfer o tour que necesitas: aeropuerto, crucero, ciudad o tour privado.",
  },
  {
    numero: "02",
    titulo: "Indica los detalles",
    descripcion:
      "Dinos la ruta, fecha, hora, número de pasajeros y equipaje. Todo en menos de 2 minutos.",
  },
  {
    numero: "03",
    titulo: "Elige tu vehículo",
    descripcion:
      "Sedán, minivan o furgoneta. El precio aparece al instante, sin sorpresas.",
  },
  {
    numero: "04",
    titulo: "Confirma y listo",
    descripcion:
      "Paga online o al conductor. Recibirás la confirmación por email al momento.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="como-funciona" id="como-funciona">
      <div className="como-funciona__contenedor">
        {/* ── Cabecera ─────────────────────────────────────────────── */}
        <div className="como-funciona__cabecera">
          <p className="seccion__eyebrow">Simple y rápido</p>
          <h2 className="seccion__titulo">Cómo Funciona</h2>
          <p className="seccion__subtitulo">
            Reserva tu transfer en menos de 3 minutos.
          </p>
        </div>

        {/* ── Pasos en línea con conectores ────────────────────────── */}
        <div className="como-funciona__pasos">
          {pasos.map((paso, index) => (
            <div key={paso.numero} className="paso">
              {/* Número del paso en amarillo */}
              <div className="paso__numero">{paso.numero}</div>

              {/* Línea conectora entre pasos (no se muestra en el último) */}
              {index < pasos.length - 1 && (
                <div className="paso__conector" aria-hidden="true" />
              )}

              {/* Contenido del paso */}
              <h3 className="paso__titulo">{paso.titulo}</h3>
              <p className="paso__descripcion">{paso.descripcion}</p>
            </div>
          ))}
        </div>

        {/* ── CTA al final de la sección ───────────────────────────── */}
        <div className="como-funciona__cta">
          <a href="/reservar" className="boton-amarillo">
            Empezar a Reservar
          </a>
        </div>
      </div>
    </section>
  );
}