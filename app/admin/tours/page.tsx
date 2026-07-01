"use client";

/**
 * app/admin/tours/page.tsx — Gestión de tours desde el panel admin
 *
 * Permite crear, editar, activar/desactivar y eliminar tours.
 * Los tours se guardan en Firestore → colección "tours".
 * La web lee los tours en tiempo real, sin tocar el código.
 */

import { useEffect, useState } from "react";
import {
  collection, onSnapshot, doc,
  updateDoc, addDoc, deleteDoc, query, orderBy
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface Tour {
  id: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  duracion: string;
  precio: number;
  precioDesde: boolean;
  imagen: string;
  imagenes: string[];
  incluye: string[];
  noIncluye: string[];
  puntoSalida: string;
  idiomas: string[];
  activo: boolean;
  orden: number;
  destacado: boolean;
  categoria: string;
}

// Tours por defecto — se cargan la primera vez
const TOURS_DEFAULT: Omit<Tour, "id">[] = [
  {
    slug: "montserrat-private-tour",
    nombre: "Montserrat Private Tour",
    descripcionCorta: "Visita privada a la montaña sagrada de Cataluña con monasterio y vistas espectaculares.",
    descripcionLarga: "Escápate a Montserrat, la montaña más emblemática de Cataluña, en un tour completamente privado. Recorremos los 50 km desde Barcelona hasta esta formación rocosa única, visitamos el Real Monasterio de Santa María con su famosa Moreneta, y disfrutamos de las vistas panorámicas desde los miradores. Tiempo libre para explorar los senderos o tomar el funicular. Un día inolvidable alejado del bullicio de la ciudad.",
    duracion: "6–7 horas",
    precio: 280,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Tiempo libre en Montserrat", "Agua mineral a bordo"],
    noIncluye: ["Entradas al funicular o museos", "Comidas y bebidas", "Guía turístico (opcional, consultar)"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English"],
    activo: true,
    orden: 1,
    destacado: true,
    categoria: "Naturaleza",
  },
  {
    slug: "costa-brava-dali-tour",
    nombre: "Costa Brava & Dalí Tour",
    descripcionCorta: "Un día recorriendo la Costa Brava y el Museo Dalí de Figueres desde Barcelona.",
    descripcionLarga: "Descubre la Costa Brava, con sus calas de agua cristalina y pueblos medievales, en este tour privado desde Barcelona. Visitamos Cadaqués, el encantador pueblo donde Dalí vivió y se inspiró, y Figueres, hogar del teatral Museo Dalí. Un recorrido perfecto para los amantes del arte surrealista y los paisajes mediterráneos más auténticos de la Costa Brava.",
    duracion: "9–10 horas",
    precio: 380,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Paradas en Cadaqués y Figueres", "Agua mineral a bordo"],
    noIncluye: ["Entrada al Museo Dalí", "Comidas", "Guía turístico"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English"],
    activo: true,
    orden: 2,
    destacado: true,
    categoria: "Arte y cultura",
  },
  {
    slug: "sagrada-familia-gothic-tour",
    nombre: "Sagrada Família & Gothic Quarter",
    descripcionCorta: "Tour privado por los grandes iconos de Barcelona: Sagrada Família, Barrio Gótico y Passeig de Gràcia.",
    descripcionLarga: "El tour perfecto para conocer Barcelona en profundidad. Comenzamos con una visita exterior a la Sagrada Família de Gaudí — la catedral más visitada de España. Continuamos por el Passeig de Gràcia, donde admiramos la Casa Batlló y la Pedrera. Por la tarde, nos adentramos en el laberíntico Barrio Gótico, el corazón medieval de la ciudad, con sus calles empedradas y plazas escondidas.",
    duracion: "4–5 horas",
    precio: 180,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Paradas en los principales iconos", "Agua mineral a bordo"],
    noIncluye: ["Entradas a monumentos", "Comidas", "Guía turístico"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English", "Français"],
    activo: true,
    orden: 3,
    destacado: false,
    categoria: "Ciudad",
  },
  {
    slug: "sitges-wine-tour",
    nombre: "Sitges & Penedès Wine Tour",
    descripcionCorta: "Visita Sitges, la joya del Mediterráneo, y las bodegas del Penedès en un mismo día.",
    descripcionLarga: "Sitges es uno de los pueblos más bonitos de la costa catalana, con sus casas blancas, sus playas y su animado paseo marítimo. Por la mañana exploramos el casco histórico y la playa. Por la tarde, nos adentramos en la comarca del Penedès, el corazón del vino catalán y el cava, para visitar una bodega familiar con cata incluida. Un día perfecto que combina mar, historia y gastronomía.",
    duracion: "7–8 horas",
    precio: 320,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Visita a bodega con cata de vinos", "Agua mineral a bordo"],
    noIncluye: ["Comidas", "Compras en bodega"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English"],
    activo: true,
    orden: 4,
    destacado: false,
    categoria: "Gastronomía",
  },
  {
    slug: "girona-medieval-tour",
    nombre: "Girona & Medieval Villages",
    descripcionCorta: "Girona, la ciudad medieval mejor conservada de Cataluña, a solo una hora de Barcelona.",
    descripcionLarga: "Girona es una de las ciudades más fotogénicas de Europa, con su famoso barrio judío, su catedral imponente y las casas de colores que se reflejan en el río Onyar — popularizada por Juego de Tronos. En este tour privado recorremos la ciudad vieja a pie (con conductor esperando), exploramos el Call judío medieval, subimos a las murallas romanas y disfrutamos de las vistas sobre los tejados de colores.",
    duracion: "6–7 horas",
    precio: 260,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1583265627959-fb7042f5133b?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1583265627959-fb7042f5133b?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Tiempo libre en Girona", "Agua mineral a bordo"],
    noIncluye: ["Entradas a museos", "Comidas", "Guía turístico"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English"],
    activo: true,
    orden: 5,
    destacado: false,
    categoria: "Arte y cultura",
  },
  {
    slug: "camino-de-ronda-tour",
    nombre: "Camino de Ronda Coastal Tour",
    descripcionCorta: "Las calas más secretas de la Costa Brava a pie, con traslado privado desde Barcelona.",
    descripcionLarga: "El Camino de Ronda es el sendero más espectacular de la Costa Brava, serpenteando entre acantilados y calas de agua turquesa. En este tour privado te llevamos hasta el tramo más salvaje y hermoso del camino, entre Calella de Palafrugell y Llafranc. Aquí caminas a tu ritmo por uno de los paisajes más espectaculares del Mediterráneo, con vistas que no olvidarás.",
    duracion: "8–9 horas",
    precio: 340,
    precioDesde: true,
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    incluye: ["Vehículo privado con conductor", "Recogida y entrega en hotel", "Tiempo libre en el sendero", "Agua mineral a bordo"],
    noIncluye: ["Comidas", "Equipo de senderismo"],
    puntoSalida: "Tu hotel en Barcelona",
    idiomas: ["Español", "English"],
    activo: true,
    orden: 6,
    destacado: false,
    categoria: "Naturaleza",
  },
];

function generarSlug(nombre: string): string {
  return nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PaginaAdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Tour | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nombre: "", slug: "", descripcionCorta: "", descripcionLarga: "",
    duracion: "", precio: 150, precioDesde: true, imagen: "",
    imagenes: "", incluye: "", noIncluye: "", puntoSalida: "Tu hotel en Barcelona",
    idiomas: "Español, English", activo: true, orden: 99,
    destacado: false, categoria: "Ciudad",
  });

  useEffect(() => {
    const q = query(collection(db, "tours"), orderBy("orden", "asc"));
    const cancelar = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        for (const tour of TOURS_DEFAULT) {
          await addDoc(collection(db, "tours"), tour);
        }
      } else {
        setTours(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tour)));
        setCargando(false);
      }
    });
    return () => cancelar();
  }, []);

  function abrirNuevo() {
    setForm({
      nombre: "", slug: "", descripcionCorta: "", descripcionLarga: "",
      duracion: "6–7 horas", precio: 200, precioDesde: true, imagen: "",
      imagenes: "", incluye: "Vehículo privado con conductor\nRecogida y entrega en hotel\nAgua mineral a bordo",
      noIncluye: "Entradas a monumentos\nComidas", puntoSalida: "Tu hotel en Barcelona",
      idiomas: "Español, English", activo: true, orden: tours.length + 1,
      destacado: false, categoria: "Ciudad",
    });
    setEditando(null);
    setMostrarFormulario(true);
  }

  function abrirEdicion(t: Tour) {
    setForm({
      nombre: t.nombre, slug: t.slug, descripcionCorta: t.descripcionCorta,
      descripcionLarga: t.descripcionLarga, duracion: t.duracion,
      precio: t.precio, precioDesde: t.precioDesde, imagen: t.imagen,
      imagenes: (t.imagenes ?? []).join("\n"),
      incluye: (t.incluye ?? []).join("\n"),
      noIncluye: (t.noIncluye ?? []).join("\n"),
      puntoSalida: t.puntoSalida, idiomas: (t.idiomas ?? []).join(", "),
      activo: t.activo, orden: t.orden, destacado: t.destacado, categoria: t.categoria,
    });
    setEditando(t);
    setMostrarFormulario(true);
  }

  async function guardar() {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio."); return; }
    setGuardando(true);
    const datos = {
      nombre: form.nombre.trim(),
      slug: form.slug.trim() || generarSlug(form.nombre),
      descripcionCorta: form.descripcionCorta.trim(),
      descripcionLarga: form.descripcionLarga.trim(),
      duracion: form.duracion.trim(),
      precio: Number(form.precio),
      precioDesde: form.precioDesde,
      imagen: form.imagen.trim(),
      imagenes: form.imagenes.split("\n").map(s => s.trim()).filter(Boolean),
      incluye: form.incluye.split("\n").map(s => s.trim()).filter(Boolean),
      noIncluye: form.noIncluye.split("\n").map(s => s.trim()).filter(Boolean),
      puntoSalida: form.puntoSalida.trim(),
      idiomas: form.idiomas.split(",").map(s => s.trim()).filter(Boolean),
      activo: form.activo,
      orden: Number(form.orden),
      destacado: form.destacado,
      categoria: form.categoria.trim(),
    };
    try {
      if (editando) {
        await updateDoc(doc(db, "tours", editando.id), datos);
      } else {
        await addDoc(collection(db, "tours"), datos);
      }
      setMostrarFormulario(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function toggleActivo(id: string, activo: boolean) {
    await updateDoc(doc(db, "tours", id), { activo: !activo });
  }

  async function eliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"? No se puede deshacer.`)) return;
    await deleteDoc(doc(db, "tours", id));
  }

  const cerrar = () => { setMostrarFormulario(false); setEditando(null); };

  if (cargando) return <div className="admin-pagina"><p className="admin-cargando-texto">Cargando tours...</p></div>;

  return (
    <div className="admin-pagina">

      <div className="admin-cabecera">
        <div>
          <h1 className="admin-titulo">Tours</h1>
          <p className="admin-cabecera__desc">Los cambios se reflejan en tiempo real en la web.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <a href="/tours" target="_blank" rel="noopener noreferrer" className="admin-btn-secundario">
            Ver en la web →
          </a>
          <button onClick={abrirNuevo} className="admin-btn-amarillo">+ Nuevo tour</button>
        </div>
      </div>

      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Tour</th>
              <th>Categoría</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Destacado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className="admin-tabla__cliente">
                    <span className="admin-tabla__nombre">{t.nombre}</span>
                    <span className="admin-tabla__email">{t.slug}</span>
                  </div>
                </td>
                <td>{t.categoria}</td>
                <td>{t.duracion}</td>
                <td><strong>{t.precioDesde ? "Desde " : ""}{t.precio}€</strong></td>
                <td>{t.destacado ? "⭐ Sí" : "—"}</td>
                <td>
                  <span className={`admin-badge ${t.activo ? "admin-badge--verde" : "admin-badge--rojo"}`}>
                    {t.activo ? "Visible" : "Oculto"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button onClick={() => abrirEdicion(t)} className="admin-btn-secundario">Editar</button>
                    <button onClick={() => toggleActivo(t.id, t.activo)} className={`admin-toggle ${t.activo ? "admin-toggle--activo" : "admin-toggle--inactivo"}`}>
                      {t.activo ? "Ocultar" : "Mostrar"}
                    </button>
                    <button onClick={() => eliminar(t.id, t.nombre)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal formulario */}
      {mostrarFormulario && (
        <div className="admin-modal-overlay" onClick={cerrar}>
          <div className="admin-modal" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__cabecera">
              <h2 className="admin-modal__titulo">{editando ? "Editar tour" : "Nuevo tour"}</h2>
              <button onClick={cerrar} className="admin-modal__cerrar">✕</button>
            </div>
            <div className="admin-modal__cuerpo">
              <div className="formulario">

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Nombre <span className="campo__requerido">*</span></label>
                    <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value, slug: generarSlug(e.target.value) })} placeholder="Montserrat Private Tour" className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Categoría</label>
                    <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="campo__input">
                      <option>Ciudad</option>
                      <option>Naturaleza</option>
                      <option>Arte y cultura</option>
                      <option>Gastronomía</option>
                      <option>Aventura</option>
                    </select>
                  </div>
                </div>

                <div className="campo">
                  <label className="campo__etiqueta">Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="montserrat-private-tour" className="campo__input" />
                  <p className="campo__ayuda">URL: /tours/{form.slug || "slug-del-tour"}</p>
                </div>

                <div className="campo">
                  <label className="campo__etiqueta">Descripción corta</label>
                  <input type="text" value={form.descripcionCorta} onChange={(e) => setForm({ ...form, descripcionCorta: e.target.value })} placeholder="Una línea que aparece en la tarjeta del listado" className="campo__input" />
                </div>

                <div className="campo">
                  <label className="campo__etiqueta">Descripción larga</label>
                  <textarea value={form.descripcionLarga} onChange={(e) => setForm({ ...form, descripcionLarga: e.target.value })} rows={5} placeholder="Descripción completa del tour para la ficha individual..." className="campo__textarea" />
                </div>

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Duración</label>
                    <input type="text" value={form.duracion} onChange={(e) => setForm({ ...form, duracion: e.target.value })} placeholder="6–7 horas" className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Precio (€)</label>
                    <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} className="campo__input" />
                  </div>
                </div>

                <div className="campo">
                  <label className="campo__etiqueta">URL imagen principal</label>
                  <input type="text" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="https://..." className="campo__input" />
                </div>

                <div className="campo">
                  <label className="campo__etiqueta">Imágenes adicionales <span className="campo__opcional">(una URL por línea)</span></label>
                  <textarea value={form.imagenes} onChange={(e) => setForm({ ...form, imagenes: e.target.value })} rows={3} placeholder="https://imagen1.jpg&#10;https://imagen2.jpg" className="campo__textarea" />
                </div>

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Incluye <span className="campo__opcional">(una línea por ítem)</span></label>
                    <textarea value={form.incluye} onChange={(e) => setForm({ ...form, incluye: e.target.value })} rows={4} className="campo__textarea" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">No incluye <span className="campo__opcional">(una línea por ítem)</span></label>
                    <textarea value={form.noIncluye} onChange={(e) => setForm({ ...form, noIncluye: e.target.value })} rows={4} className="campo__textarea" />
                  </div>
                </div>

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Punto de salida</label>
                    <input type="text" value={form.puntoSalida} onChange={(e) => setForm({ ...form, puntoSalida: e.target.value })} className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Idiomas <span className="campo__opcional">(separados por coma)</span></label>
                    <input type="text" value={form.idiomas} onChange={(e) => setForm({ ...form, idiomas: e.target.value })} placeholder="Español, English" className="campo__input" />
                  </div>
                </div>

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Orden</label>
                    <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} className="campo__input" />
                  </div>
                  <div className="campo" style={{ justifyContent: "flex-end", gap: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                      <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} style={{ width: "18px", height: "18px" }} />
                      ⭐ Destacado
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                      <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} style={{ width: "18px", height: "18px" }} />
                      Visible en la web
                    </label>
                  </div>
                </div>

              </div>

              <div className="admin-modal__acciones">
                <button onClick={cerrar} className="boton-atras">Cancelar</button>
                <button onClick={guardar} disabled={guardando} className="admin-btn-amarillo">
                  {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear tour"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}