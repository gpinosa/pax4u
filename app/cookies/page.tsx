/**
 * app/cookies/page.tsx — Política de Cookies
 *
 * Adaptada a la Ley 34/2002 de Servicios de la Sociedad de la Información
 * (LSSI-CE) y al RGPD. Obligatoria para webs que usen cookies no esenciales.
 */

import Navbar from "../components/navbar";


export const metadata = {
  title: "Política de Cookies — Pax4u Barcelona",
  description: "Información sobre el uso de cookies en la web de Pax4u.",
};

export default function PaginaCookies() {
  return (
    <>
      <Navbar />
      <main className="pagina-legal">
        <div className="legal-contenedor">

          <div className="legal-cabecera">
            <p className="legal-eyebrow">Información legal</p>
            <h1 className="legal-titulo">Política de Cookies</h1>
            <p className="legal-fecha">Última actualización: julio de 2025</p>
          </div>

          <div className="legal-cuerpo">

            <section className="legal-seccion">
              <h2>1. ¿Qué son las cookies?</h2>
              <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para que el sitio funcione correctamente, recordar tus preferencias y recopilar información estadística.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}