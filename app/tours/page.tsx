"use client";

/**
 * app/tours/page.tsx — Listado de tours privados
 *
 * Lee los tours desde Firestore (colección "tours").
 * Si es la primera vez, inicializa con los tours por defecto.
 *
 * Cada tarjeta muestra:
 * - Imagen de portada
 * - Nombre del tour
 * - Duración y precio
 * - Descripción breve
 * - Botón a la ficha individual
 */

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

export interface Tour {
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

export default function PaginaTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const q = query(collection(db, "tours"), orderBy("orden", "asc"));
    const cancelar = onSnapshot(q, (snap) => {
      const datos = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Tour))
        .filter((t) => t.activo);
      setTours(datos);
      setCargando(false);
    });
    return () => cancelar();
  }, []);

  const categorias = ["todos", ...Array.from(new Set(tours.map((t) => t.categoria)))];
  const toursFiltrados = filtro === "todos" ? tours : tours.filter((t) => t.categoria === filtro);

  return (
    <>
      <Navbar />
      <main className="pagina-tours">

        {/* ── Cabecera ── */}
        <div className="tours-cabecera">
          <p className="tours-cabecera__eyebrow">Experiencias exclusivas</p>
          <h1 className="tours-cabecera__titulo">Tours Privados en Barcelona</h1>
          <p className="tours-cabecera__subtitulo">
            Descubre Cataluña con un guía privado y vehículo exclusivo.
            Sin grupos, sin prisas, a tu ritmo.
          </p>
        </div>

        {/* ── Filtros por categoría ── */}
        {categorias.length > 2 && (
          <div className="tours-filtros">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`tours-filtro-btn ${filtro === cat ? "tours-filtro-btn--activo" : ""}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid de tours ── */}
        <div className="tours-contenedor">
          {cargando ? (
            <div className="tours-cargando">
              <p>Cargando tours...</p>
            </div>
          ) : toursFiltrados.length === 0 ? (
            <div className="tours-vacio">
              <p>No hay tours disponibles en este momento.</p>
            </div>
          ) : (
            <div className="tours-grid">
              {toursFiltrados.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`} className="tour-card">

                  {/* Imagen */}
                  <div className="tour-card__imagen-wrap">
                    <img
                      src={tour.imagen}
                      alt={tour.nombre}
                      className="tour-card__imagen"
                      loading="lazy"
                    />
                    {tour.destacado && (
                      <span className="tour-card__badge">⭐ Más popular</span>
                    )}
                    <span className="tour-card__categoria">{tour.categoria}</span>
                  </div>

                  {/* Contenido */}
                  <div className="tour-card__cuerpo">
                    <h2 className="tour-card__nombre">{tour.nombre}</h2>
                    <p className="tour-card__descripcion">{tour.descripcionCorta}</p>

                    <div className="tour-card__meta">
                      <span className="tour-card__duracion">⏱ {tour.duracion}</span>
                      <span className="tour-card__idiomas">🌍 {tour.idiomas.join(" · ")}</span>
                    </div>

                    <div className="tour-card__footer">
                      <div className="tour-card__precio">
                        <span className="tour-card__precio-desde">
                          {tour.precioDesde ? "Desde" : "Precio"}
                        </span>
                        <span className="tour-card__precio-valor">{tour.precio}€</span>
                      </div>
                      <span className="tour-card__cta">Ver tour →</span>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Banner CTA ── */}
        <div className="tours-banner-cta">
          <div className="tours-banner-cta__contenido">
            <h2>¿No encuentras lo que buscas?</h2>
            <p>Diseñamos tours personalizados según tus intereses, tiempo y grupo.</p>
            <a href="/contacto" className="boton-amarillo">Contactar para tour personalizado →</a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}