/**
 * Footer.tsx — Pie de página de Pax4u
 *
 * Incluye:
 * - Logo y descripción breve
 * - Links de navegación principales
 * - Links legales obligatorios (Privacidad, Cookies, Condiciones)
 * - Copyright
 */

const anyo = new Date().getFullYear();

const LINKS_SERVICIOS = [
  { href: "/reservar?servicio=aeropuerto-privado", label: "Transfer Aeropuerto" },
  { href: "/reservar?servicio=crucero", label: "Transfer Crucero" },
  { href: "/reservar?servicio=tours", label: "Barcelona Tours" },
  { href: "/reservar?servicio=conductor-privado", label: "Conductor Privado" },
];

const LINKS_EMPRESA = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/contacto", label: "Contacto" },
  { href: "/#servicios", label: "Servicios" },
];

const LINKS_LEGALES = [
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/condiciones", label: "Condiciones de reserva" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenedor">

        {/* ── Columna logo y descripción ── */}
        <div className="footer__marca">
          <div className="footer__logo">
            <span className="footer__logo-pax">PA</span>
            <span className="footer__logo-x">X</span>
            <span className="footer__logo-pax">4U</span>
          </div>
          <p className="footer__descripcion">
            Transfers privados y tours en Barcelona. Precio fijo, conductores profesionales y servicio 24/7.
          </p>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__whatsapp"
          >
            💬 +34 600 000 000
          </a>
        </div>

        {/* ── Columna servicios ── */}
        <div className="footer__columna">
          <h3 className="footer__columna-titulo">Servicios</h3>
          <ul className="footer__links">
            {LINKS_SERVICIOS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer__link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna empresa ── */}
        <div className="footer__columna">
          <h3 className="footer__columna-titulo">Empresa</h3>
          <ul className="footer__links">
            {LINKS_EMPRESA.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer__link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna legal ── */}
        <div className="footer__columna">
          <h3 className="footer__columna-titulo">Legal</h3>
          <ul className="footer__links">
            {LINKS_LEGALES.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer__link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Barra inferior de copyright ── */}
      <div className="footer__copyright">
        <div className="footer__copyright-contenedor">
          <p>© {anyo} Pax4u · Transfers Privados Barcelona · Todos los derechos reservados</p>
          <div className="footer__copyright-links">
            {LINKS_LEGALES.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}