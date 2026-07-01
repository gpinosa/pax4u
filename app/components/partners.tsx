/**
 * Partners - Banda de logos de plataformas partner
 *
 * Genera confianza mostrando las plataformas donde Pax4u estará presente.
 * En Fase 1 son logos decorativos; en Fase 2 se conectarán por API real.
 *
 * Para añadir partners:
 * - Añadir entradas al array `partners`
 * - Reemplazar los textos por <Image> de next/image con los logos reales
 *
 * Nota: cuando los logos reales estén disponibles,
 * cambiar los <span> de texto por <Image src="..." alt="..." />
 */

// ─── Plataformas con las que Pax4u trabaja o trabajará ───────────────────────
const partners = [
  { nombre: "Booking.com", slug: "booking" },
  { nombre: "Viator", slug: "viator" },
  { nombre: "GetYourGuide", slug: "getyourguide" },
  { nombre: "Expedia", slug: "expedia" },
  { nombre: "Welcome Pickups", slug: "welcome" },
];

export default function Partners() {
  return (
    <section className="partners">
      <div className="partners__contenedor">
        <p className="partners__etiqueta">Disponible también en</p>

        {/* ── Banda de logos ───────────────────────────────────────── */}
        <div className="partners__logos">
          {partners.map((partner) => (
            <div key={partner.slug} className="partners__logo">
              {/*
               * TODO Fase 2: reemplazar por <Image> con el logo real:
               * <Image src={`/logos/${partner.slug}.svg`} alt={partner.nombre} width={120} height={40} />
               */}
              <span className="partners__logo-texto">{partner.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}