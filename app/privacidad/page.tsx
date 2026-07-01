/**
 * app/privacidad/page.tsx — Política de Privacidad
 *
 * Adaptada al RGPD (Reglamento General de Protección de Datos)
 * y a la LOPDGDD (Ley Orgánica 3/2018, España).
 *
 * IMPORTANTE: Cuando registres la empresa, rellena los campos
 * marcados con [PENDIENTE] con los datos reales.
 */

import Navbar from "../components/navbar";



export const metadata = {
  title: "Política de Privacidad — Pax4u Barcelona",
  description: "Política de privacidad y protección de datos de Pax4u.",
};

export default function PaginaPrivacidad() {
  return (
    <>
      <Navbar />
      <main className="pagina-legal">
        <div className="legal-contenedor">

          <div className="legal-cabecera">
            <p className="legal-eyebrow">Información legal</p>
            <h1 className="legal-titulo">Política de Privacidad</h1>
            <p className="legal-fecha">Última actualización: julio de 2025</p>
          </div>

          <div className="legal-cuerpo">

            <section className="legal-seccion">
              <h2>1. Responsable del tratamiento</h2>
              <p>En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos (LOPDGDD), te informamos que el responsable del tratamiento de tus datos personales es:</p>
              <div className="legal-datos-empresa">
                <p><strong>Denominación:</strong> Pax4u</p>
                <p><strong>CIF/NIF:</strong> [PENDIENTE — rellenar al registrar la empresa]</p>
                <p><strong>Domicilio:</strong> Barcelona, España</p>
                <p><strong>Email:</strong> info@pax4u.com</p>
                <p><strong>Teléfono:</strong> +34 600 000 000</p>
              </div>
            </section>


          </div>
        </div>
      </main>
    </>
  );
}