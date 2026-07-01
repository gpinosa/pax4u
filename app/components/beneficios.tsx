/**
 * Para modificar los beneficios:
 * - Editar el array beneficios con nuevos ítems
 * - Cada ítem tiene: icono, titulo, descripcion
 */

// ─── Propuestas de valor diferenciales ────────────────────────────────────────
const beneficios = [
  {
    icono: "💰",
    titulo: "Precio Fijo",
    descripcion:
      "El precio que ves es el que pagas. Sin tarifas ocultas ni sorpresas al llegar.",
  },
  {
    icono: "⏱️",
    titulo: "Puntualidad Garantizada",
    descripcion:
      "Monitorizamos tu vuelo en tiempo real para estar en el aeropuerto cuando llegues.",
  },
  {
    icono: "🌍",
    titulo: "Servicio Multilingüe",
    descripcion:
      "Nuestros conductores hablan inglés y español. Atención al cliente 24/7.",
  },
  {
    icono: "⭐",
    titulo: "Conductores Verificados",
    descripcion:
      "Todos nuestros conductores pasan por un proceso de selección y formación.",
  },
];

export default function Beneficios() {
  return (
    <section className="beneficios" id="beneficios">
      <div className="beneficios__contenedor">
        {/* ── Cabecera ─────────────────────────────────────────────── */}
        <div className="beneficios__cabecera">
          <p className="seccion__eyebrow seccion__eyebrow--amarillo">
            Por qué elegirnos
          </p>
          <h2 className="seccion__titulo seccion__titulo--blanco">
            La diferencia Pax4u
          </h2>
        </div>

        {/* ── Grid de beneficios ───────────────────────────────────── */}
        <div className="beneficios__grid">
          {beneficios.map((item) => (
            <div key={item.titulo} className="beneficio-card">
              <span className="beneficio-card__icono">{item.icono}</span>
              <h3 className="beneficio-card__titulo">{item.titulo}</h3>
              <p className="beneficio-card__descripcion">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
