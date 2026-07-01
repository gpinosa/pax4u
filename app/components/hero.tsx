/**
 * Hero - Sección principal de la Home
 *
 * Es lo primero que ve el usuario al entrar. Su único objetivo es:
 * 1. Comunicar qué es Pax4u en menos de 3 segundos
 * 2. Llevar al usuario al botón de reserva
 *
 * Diseño:
 * - Fondo oscuro con imagen de Barcelona (overlay negro al 60%)
 * - Título grande y directo
 * - Subtítulo con los 3 beneficios clave
 * - Botón "Reservar Ahora" en amarillo (CTA principal)
 * - Badges de confianza debajo (precio fijo, 24/7, profesional)
 *
 * Para cambiar la imagen de fondo:
 * - Reemplazar la URL en el style `backgroundImage`
 * - O usar next/image con fill y objectFit: cover
 */

// ─── Beneficios que aparecen bajo el botón ───────────────────────────────────
const badges = [
  { icono: "✓", texto: "Precio fijo garantizado" },
  { icono: "✓", texto: "Disponible 24/7" },
  { icono: "✓", texto: "Conductores profesionales" },
];

export default function Hero() {
  return (
    <section className="hero">
      {/* ── Overlay oscuro sobre la imagen de fondo ──────────────────── */}
      <div className="hero__overlay" />

      {/* ── Contenido centrado ───────────────────────────────────────── */}
      <div className="hero__contenido">
        {/* Eyebrow: categoría del servicio */}
        <p className="hero__eyebrow">Transfers Privados · Barcelona</p>

        {/* Título principal: claro, directo, orientado a conversión */}
        <h1 className="hero__titulo">
          Tu transfer privado
          <br />
          <span className="hero__titulo-amarillo">en Barcelona</span>
        </h1>

        {/* Subtítulo: explica el valor principal sin florituras */}
        <p className="hero__subtitulo">
          Aeropuerto, crucero, hotel o tour. Reserva en minutos y viaja
          con tranquilidad. Precio cerrado, sin sorpresas.
        </p>

        {/* CTA principal: el botón más importante de toda la web */}
        <a href="/reservar" className="hero__boton">
          Reservar Ahora
        </a>

        {/* Badges de confianza: refuerzan la decisión de compra */}
        <div className="hero__badges">
          {badges.map((badge) => (
            <span key={badge.texto} className="hero__badge">
              <span className="hero__badge-icono">{badge.icono}</span>
              {badge.texto}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}