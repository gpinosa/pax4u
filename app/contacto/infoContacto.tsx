/**
 * InfoContacto — Panel lateral con toda la información de contacto
 *
 * Muestra:
 * - Botón grande de WhatsApp (CTA principal)
 * - Teléfono directo
 * - Email
 * - Redes sociales (Instagram, Facebook, TripAdvisor)
 * - Horario de atención
 *
 * Para actualizar los datos de contacto:
 * - Editar el objeto CONTACTO más abajo
 * - El número de WhatsApp debe ir en formato internacional sin + ni espacios
 *   Ejemplo: España +34 612 345 678 → "34612345678"
 */

// ─── Datos de contacto — EDITAR AQUÍ ─────────────────────────────────────────
const CONTACTO = {
  whatsapp: {
    numero: "34600000000",           // Formato internacional sin + ni espacios
    numeroMostrar: "+34 600 000 000", // Formato visible para el usuario
    mensajePredefinido: "Hola, me gustaría obtener más información sobre vuestros servicios de transfer en Barcelona.",
  },
  telefono: {
    numero: "+34600000000",
    mostrar: "+34 600 000 000",
  },
  email: "info@pax4u.com",
  horario: [
    { dias: "Lunes – Viernes", horas: "07:00 – 23:00" },
    { dias: "Sábado y Domingo", horas: "08:00 – 22:00" },
    { dias: "Soporte urgente", horas: "24/7 por WhatsApp" },
  ],
  redes: [
    {
      nombre: "Instagram",
      icono: "📸",
      url: "https://instagram.com/pax4u",
      handle: "@pax4u",
    },
    {
      nombre: "Facebook",
      icono: "👥",
      url: "https://facebook.com/pax4u",
      handle: "Pax4u Barcelona",
    },
    {
      nombre: "TripAdvisor",
      icono: "⭐",
      url: "https://tripadvisor.com",
      handle: "Pax4u en TripAdvisor",
    },
  ],
};

// Genera la URL de WhatsApp con el mensaje predefinido
function urlWhatsApp(): string {
  const msg = encodeURIComponent(CONTACTO.whatsapp.mensajePredefinido);
  return `https://wa.me/${CONTACTO.whatsapp.numero}?text=${msg}`;
}

export default function InfoContacto() {
  return (
    <div className="info-contacto">

      {/* ── Botón WhatsApp — CTA principal ───────────────────────────
       * Es el canal más rápido y el que más convierte para turistas.
       * Se abre directamente en la app de WhatsApp del usuario.
       * ─────────────────────────────────────────────────────────── */}
      <a
        href={urlWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        className="info-contacto__whatsapp"
      >
        <span className="info-contacto__whatsapp-icono">💬</span>
        <div>
          <span className="info-contacto__whatsapp-titulo">
            Escríbenos por WhatsApp
          </span>
          <span className="info-contacto__whatsapp-numero">
            {CONTACTO.whatsapp.numeroMostrar}
          </span>
        </div>
        <span className="info-contacto__whatsapp-flecha">→</span>
      </a>

      {/* ── Canales de contacto ──────────────────────────────────── */}
      <div className="info-contacto__canales">

        {/* Teléfono */}
        <a
          href={`tel:${CONTACTO.telefono.numero}`}
          className="info-contacto__canal"
        >
          <span className="info-contacto__canal-icono">📞</span>
          <div className="info-contacto__canal-texto">
            <span className="info-contacto__canal-label">Teléfono</span>
            <span className="info-contacto__canal-valor">
              {CONTACTO.telefono.mostrar}
            </span>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${CONTACTO.email}`}
          className="info-contacto__canal"
        >
          <span className="info-contacto__canal-icono">✉️</span>
          <div className="info-contacto__canal-texto">
            <span className="info-contacto__canal-label">Email</span>
            <span className="info-contacto__canal-valor">{CONTACTO.email}</span>
          </div>
        </a>

      </div>

      {/* ── Horario de atención ───────────────────────────────────── */}
      <div className="info-contacto__horario">
        <h3 className="info-contacto__seccion-titulo">Horario de atención</h3>
        <div className="info-contacto__horario-lista">
          {CONTACTO.horario.map((item) => (
            <div key={item.dias} className="info-contacto__horario-fila">
              <span className="info-contacto__horario-dias">{item.dias}</span>
              <span className="info-contacto__horario-horas">{item.horas}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Redes sociales ────────────────────────────────────────── */}
      <div className="info-contacto__redes">
        <h3 className="info-contacto__seccion-titulo">Síguenos</h3>
        <div className="info-contacto__redes-lista">
          {CONTACTO.redes.map((red) => (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              className="info-contacto__red"
              aria-label={`Síguenos en ${red.nombre}`}
            >
              <span className="info-contacto__red-icono">{red.icono}</span>
              <div className="info-contacto__red-texto">
                <span className="info-contacto__red-nombre">{red.nombre}</span>
                <span className="info-contacto__red-handle">{red.handle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Nota de respuesta rápida ─────────────────────────────── */}
      <p className="info-contacto__nota">
        ⚡ Tiempo de respuesta medio: <strong>menos de 30 minutos</strong>
      </p>

    </div>
  );
}