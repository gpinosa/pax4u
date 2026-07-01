"use client";

/**
 * app/tours/[slug]/page.tsx — Ficha individual de tour
 *
 * Ruta dinámica: /tours/montserrat-private-tour
 *
 * Muestra:
 * - Galería de imágenes
 * - Descripción completa
 * - Qué incluye / no incluye
 * - Duración, idiomas, punto de salida
 * - Precio y botón de reserva directo al wizard
 */

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import type { Tour } from "../page";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/navbar";

export default function PaginaTour() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [cargando, setCargando] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    async function cargarTour() {
      try {
        const q = query(collection(db, "tours"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setTour({ id: snap.docs[0].id, ...snap.docs[0].data() } as Tour);
        } else {
          router.push("/tours");
        }
      } catch (err) {
        console.error(err);
        router.push("/tours");
      } finally {
        setCargando(false);
      }
    }
    if (slug) cargarTour();
  }, [slug, router]);

  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="tour-ficha-cargando">
          <p>Cargando tour...</p>
        </div>
      </>
    );
  }

  if (!tour) return null;

  const todasImagenes = [tour.imagen, ...(tour.imagenes ?? [])].filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="tour-ficha">

        {/* ── Breadcrumb ── */}
        <div className="tour-ficha__breadcrumb">
          <a href="/">Inicio</a>
          <span>→</span>
          <a href="/tours">Tours</a>
          <span>→</span>
          <span>{tour.nombre}</span>
        </div>

        <div className="tour-ficha__contenedor">

          {/* ── Columna izquierda: galería + descripción ── */}
          <div className="tour-ficha__izquierda">

            {/* Galería */}
            <div className="tour-galeria">
              <div className="tour-galeria__principal">
                <img
                  src={todasImagenes[imagenActiva]}
                  alt={`${tour.nombre} — imagen ${imagenActiva + 1}`}
                  className="tour-galeria__imagen"
                />
                {tour.destacado && (
                  <span className="tour-galeria__badge">⭐ Más popular</span>
                )}
              </div>

              {/* Miniaturas */}
              {todasImagenes.length > 1 && (
                <div className="tour-galeria__miniaturas">
                  {todasImagenes.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImagenActiva(i)}
                      className={`tour-galeria__miniatura ${imagenActiva === i ? "tour-galeria__miniatura--activa" : ""}`}
                    >
                      <img src={img} alt={`Miniatura ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="tour-ficha__descripcion">
              <h2>Sobre este tour</h2>
              <p>{tour.descripcionLarga}</p>
            </div>

            {/* Qué incluye */}
            <div className="tour-ficha__incluye">
              <div className="tour-ficha__incluye-col">
                <h3>✓ Incluye</h3>
                <ul>
                  {tour.incluye?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tour-ficha__incluye-col tour-ficha__incluye-col--no">
                <h3>✗ No incluye</h3>
                <ul>
                  {tour.noIncluye?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* ── Columna derecha: reserva ── */}
          <div className="tour-ficha__derecha">
            <div className="tour-reserva-card">

              {/* Nombre y precio */}
              <h1 className="tour-reserva-card__nombre">{tour.nombre}</h1>

              <div className="tour-reserva-card__precio">
                <span className="tour-reserva-card__precio-desde">
                  {tour.precioDesde ? "Desde" : "Precio"}
                </span>
                <span className="tour-reserva-card__precio-valor">{tour.precio}€</span>
                <span className="tour-reserva-card__precio-nota">por vehículo · precio fijo</span>
              </div>

              {/* Detalles rápidos */}
              <div className="tour-reserva-card__detalles">
                <div className="tour-reserva-card__detalle">
                  <span className="tour-reserva-card__detalle-icono">⏱</span>
                  <div>
                    <span className="tour-reserva-card__detalle-label">Duración</span>
                    <span className="tour-reserva-card__detalle-valor">{tour.duracion}</span>
                  </div>
                </div>
                <div className="tour-reserva-card__detalle">
                  <span className="tour-reserva-card__detalle-icono">📍</span>
                  <div>
                    <span className="tour-reserva-card__detalle-label">Salida desde</span>
                    <span className="tour-reserva-card__detalle-valor">{tour.puntoSalida}</span>
                  </div>
                </div>
                <div className="tour-reserva-card__detalle">
                  <span className="tour-reserva-card__detalle-icono">🌍</span>
                  <div>
                    <span className="tour-reserva-card__detalle-label">Idiomas</span>
                    <span className="tour-reserva-card__detalle-valor">{tour.idiomas?.join(", ")}</span>
                  </div>
                </div>
                <div className="tour-reserva-card__detalle">
                  <span className="tour-reserva-card__detalle-icono">👥</span>
                  <div>
                    <span className="tour-reserva-card__detalle-label">Tipo</span>
                    <span className="tour-reserva-card__detalle-valor">Tour 100% privado</span>
                  </div>
                </div>
              </div>

              {/* Botón reservar */}
              <a
                href={`/reservar?servicio=tours`}
                className="tour-reserva-card__boton"
              >
                Reservar este tour →
              </a>

              {/* Contacto alternativo */}
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="tour-reserva-card__whatsapp"
              >
                💬 Preguntar por WhatsApp
              </a>

              {/* Garantías */}
              <div className="tour-reserva-card__garantias">
                <span>✓ Precio fijo</span>
                <span>✓ Cancelación gratuita 24h</span>
                <span>✓ Conductor profesional</span>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}