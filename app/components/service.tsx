/**
 * Servicios - Sección de servicios principales de la Home
 *
 * Los títulos de las tarjetas usan los términos exactos que buscan
 * los turistas internacionales en Google (SEO keywords reales):
 *   - Private Airport Transfer
 *   - Barcelona Airport Transfer
 *   - Private Taxi Barcelona
 *   - Barcelona Tours
 *   - Cruise Port Transfer
 *   - Hotel Transfer
 *   - Private Driver Service
 *
 * El slug de cada servicio se pasa como parámetro al wizard de reserva
 * (paso 1 preseleccionado) a través de la URL: /reservar?servicio=aeropuerto
 *
 * Para añadir o editar servicios:
 * - Modificar el array `servicios` más abajo
 * - El campo `keywordSeo` es el término exacto de búsqueda (para metatags)
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Servicio {
  slug: string;
  icono: string;
  titulo: string;           // Término SEO real en inglés (lo buscan así)
  tituloEs: string;         // Título en español para el cuerpo de la tarjeta
  descripcion: string;
  keywordSeo: string;       // Keyword principal para metatags y alt texts
}

// ─── Servicios con keywords SEO reales ───────────────────────────────────────
// IMPORTANTE: los títulos en inglés son intencionados — son los términos exactos
// que los turistas buscan en Google. No traducir al español.
const servicios: Servicio[] = [
  {
    slug: "aeropuerto-barcelona",
    icono: "🛬",
    titulo: "Barcelona Airport Transfer",
    tituloEs: "Transfer Aeropuerto Barcelona",
    descripcion:
      "Llega a Barcelona con tu transfer ya reservado. Precio fijo desde/hacia el aeropuerto.",
    keywordSeo: "barcelona airport transfer",
  },
  {
    slug: "taxi-privado",
    icono: "🚖",
    titulo: "Private Taxi Barcelona",
    tituloEs: "Taxi Privado en Barcelona",
    descripcion:
      "Vehículo privado con conductor para moverte por la ciudad. Sin taxímetro, precio cerrado.",
    keywordSeo: "private taxi barcelona",
  },
  {
    slug: "tours",
    icono: "🗺️",
    titulo: "Barcelona Tours",
    tituloEs: "Tours Privados por Barcelona",
    descripcion:
      "Tours exclusivos en vehículo privado: Sagrada Família, Montserrat, Costa Brava y más.",
    keywordSeo: "barcelona tours private",
  },
  {
    slug: "crucero",
    icono: "🚢",
    titulo: "Cruise Port Transfer",
    tituloEs: "Transfer Puerto de Cruceros",
    descripcion:
      "Transfer directo entre el Puerto de Cruceros y el aeropuerto u hotel. Puntualidad garantizada.",
    keywordSeo: "cruise port transfer barcelona",
  },
  {
    slug: "hotel",
    icono: "🏨",
    titulo: "Hotel Transfer",
    tituloEs: "Transfer al Hotel",
    descripcion:
      "Recogida en cualquier hotel de Barcelona. Ideal para grupos y familias con equipaje.",
    keywordSeo: "hotel transfer barcelona",
  },
  {
    slug: "conductor-privado",
    icono: "🚗",
    titulo: "Private Driver Service",
    tituloEs: "Servicio de Conductor Privado",
    descripcion:
      "Tu conductor personal por horas o día completo. Para eventos, negocios o turismo.",
    keywordSeo: "private driver service barcelona",
  },
];

export default function Servicios() {
  return (
    <section className="servicios" id="servicios">
      <div className="servicios__contenedor">

        {/* ── Cabecera de sección ───────────────────────────────────── */}
        <div className="servicios__cabecera">
          <p className="seccion__eyebrow">Lo que ofrecemos</p>
          <h2 className="seccion__titulo">Nuestros Servicios</h2>
          <p className="seccion__subtitulo">
            Transfers privados y tours en Barcelona con precio fijo,
            sin sorpresas y con conductor profesional.
          </p>
        </div>

        {/* ── Grid de tarjetas de servicio ─────────────────────────── */}
        {/*
         * El href incluye el slug como query param para preseleccionar
         * el tipo de servicio en el paso 1 del wizard de reserva.
         * Ejemplo: /reservar?servicio=aeropuerto-privado
         */}
        <div className="servicios__grid">
          {servicios.map((servicio) => (
            <a
              key={servicio.slug}
              href={`/reservar?servicio=${servicio.slug}`}
              className="servicio-card"
              aria-label={`Reservar ${servicio.tituloEs}`}
            >
              {/* Icono visual del servicio */}
              <span className="servicio-card__icono" aria-hidden="true">
                {servicio.icono}
              </span>

              {/* Título en inglés (keyword SEO) */}
              <h3 className="servicio-card__titulo">{servicio.titulo}</h3>

              {/* Subtítulo en español */}
              <p className="servicio-card__subtitulo-es">{servicio.tituloEs}</p>

              {/* Descripción breve del servicio */}
              <p className="servicio-card__descripcion">
                {servicio.descripcion}
              </p>

              {/* CTA de la tarjeta */}
              <span className="servicio-card__link">Reservar →</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}