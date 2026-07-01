/**
 * app/contacto/page.tsx — Página de contacto de Pax4u
 *
 * Ruta: /contacto
 *
 * Secciones:
 * - Cabecera con título y descripción
 * - Formulario de contacto (componente cliente)
 * - Panel de información: WhatsApp, teléfono, email, redes, horario
 *
 * TODO Fase 2: conectar el formulario a un endpoint de email.
 * Opciones recomendadas sin backend propio:
 *   - Resend (resend.com) — API de email, muy fácil con Next.js
 *   - EmailJS — envío directo desde el cliente, sin servidor
 *   - Formspree — formularios gestionados externamente
 */

import Navbar from "../components/navbar";
import FormularioContacto from "./formularioContacto";
import InfoContacto from "./infoContacto";



export const metadata = {
  title: "Contacto — Pax4u Barcelona",
  description:
    "Contacta con Pax4u para reservas, información o soporte. Disponibles 24/7 por WhatsApp, teléfono y email.",
};

export default function PaginaContacto() {
  return (
    <>
      <Navbar />

      <main className="pagina-contacto">
        {/* ── Cabecera ──────────────────────────────────────────────── */}
        <div className="pagina-contacto__cabecera">
          <p className="pagina-contacto__eyebrow">Estamos aquí para ayudarte</p>
          <h1 className="pagina-contacto__titulo">Contacto</h1>
          <p className="pagina-contacto__subtitulo">
            ¿Tienes alguna pregunta o necesitas ayuda con tu reserva?
            Responderemos en menos de 30 minutos.
          </p>
        </div>

        {/* ── Grid: formulario (izquierda) + info (derecha) ────────── */}
        <div className="pagina-contacto__contenedor">
          <div className="pagina-contacto__grid">
            <div className="pagina-contacto__col-formulario">
              <FormularioContacto />
            </div>
            <div className="pagina-contacto__col-info">
              <InfoContacto />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}