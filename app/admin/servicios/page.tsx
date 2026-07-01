"use client";

/**
 * app/admin/servicios/page.tsx — Gestión de servicios y tours
 *
 * Permite:
 * - Activar o desactivar servicios (visible en la home)
 * - Editar nombre, descripción y precio de cada servicio
 * - Los cambios se guardan en Firestore → colección "servicios"
 *
 * En Fase 2: la home y el wizard leerán los servicios desde
 * Firestore en lugar del array hardcodeado en tipos-reserva.ts
 */

import { useEffect, useState } from "react";
import {
  collection, onSnapshot, doc, updateDoc, setDoc
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// ─── Tipo de servicio ─────────────────────────────────────────────────────────
interface Servicio {
  id: string;
  slug: string;
  icono: string;
  tituloEn: string;
  tituloEs: string;
  descripcion: string;
  activo: boolean;
  orden: number;
}

// ─── Servicios iniciales (se cargan en Firestore la primera vez) ──────────────
const SERVICIOS_INICIALES: Omit<Servicio, "id">[] = [
  { slug: "aeropuerto-privado", icono: "✈️", tituloEn: "Private Airport Transfer", tituloEs: "Transfer Privado al Aeropuerto", descripcion: "Recogida y entrega en el Aeropuerto El Prat.", activo: true, orden: 1 },
  { slug: "aeropuerto-barcelona", icono: "🛬", tituloEn: "Barcelona Airport Transfer", tituloEs: "Transfer Aeropuerto Barcelona", descripcion: "Transfer con precio fijo desde/hacia el aeropuerto.", activo: true, orden: 2 },
  { slug: "taxi-privado", icono: "🚖", tituloEn: "Private Taxi Barcelona", tituloEs: "Taxi Privado en Barcelona", descripcion: "Vehículo privado con conductor para moverte por la ciudad.", activo: true, orden: 3 },
  { slug: "tours", icono: "🗺️", tituloEn: "Barcelona Tours", tituloEs: "Tours Privados por Barcelona", descripcion: "Tours exclusivos: Sagrada Família, Montserrat, Costa Brava.", activo: true, orden: 4 },
  { slug: "crucero", icono: "🚢", tituloEn: "Cruise Port Transfer", tituloEs: "Transfer Puerto de Cruceros", descripcion: "Transfer directo al Puerto de Cruceros de Barcelona.", activo: true, orden: 5 },
  { slug: "hotel", icono: "🏨", tituloEn: "Hotel Transfer", tituloEs: "Transfer al Hotel", descripcion: "Recogida en cualquier hotel de Barcelona.", activo: true, orden: 6 },
  { slug: "conductor-privado", icono: "🚗", tituloEn: "Private Driver Service", tituloEs: "Servicio de Conductor Privado", descripcion: "Tu conductor personal por horas o día completo.", activo: true, orden: 7 },
];

export default function PaginaServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Servicio | null>(null);
  const [guardando, setGuardando] = useState(false);

  // ─── Cargar servicios desde Firestore ──────────────────────────────────
  useEffect(() => {
    const cancelar = onSnapshot(collection(db, "servicios"), async (snap) => {
      if (snap.empty) {
        // Primera vez: inicializar con los datos por defecto
        await inicializarServicios();
      } else {
        const datos = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Servicio))
          .sort((a, b) => a.orden - b.orden);
        setServicios(datos);
        setCargando(false);
      }
    });
    return () => cancelar();
  }, []);

  // ─── Inicializar servicios en Firestore (primera vez) ──────────────────
  async function inicializarServicios() {
    for (const servicio of SERVICIOS_INICIALES) {
      await setDoc(doc(db, "servicios", servicio.slug), servicio);
    }
  }

  // ─── Activar / desactivar servicio ─────────────────────────────────────
  async function toggleActivo(id: string, activo: boolean) {
    await updateDoc(doc(db, "servicios", id), { activo: !activo });
  }

  // ─── Guardar edición ───────────────────────────────────────────────────
  async function guardarEdicion() {
    if (!editando) return;
    setGuardando(true);
    try {
      await updateDoc(doc(db, "servicios", editando.id), {
        tituloEs: editando.tituloEs,
        tituloEn: editando.tituloEn,
        descripcion: editando.descripcion,
      });
      setEditando(null);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <div className="admin-pagina"><p className="admin-cargando-texto">Cargando servicios...</p></div>;
  }

  return (
    <div className="admin-pagina">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="admin-cabecera">
        <h1 className="admin-titulo">Servicios</h1>
        <p className="admin-cabecera__desc">
          Activa o desactiva servicios para que aparezcan en la web.
        </p>
      </div>

      {/* ── Lista de servicios ────────────────────────────────────── */}
      <div className="admin-servicios-lista">
        {servicios.map((s) => (
          <div key={s.id} className={`admin-servicio-row ${!s.activo ? "admin-servicio-row--inactivo" : ""}`}>

            {/* Icono y nombres */}
            <div className="admin-servicio-row__info">
              <span className="admin-servicio-row__icono">{s.icono}</span>
              <div>
                <p className="admin-servicio-row__titulo-en">{s.tituloEn}</p>
                <p className="admin-servicio-row__titulo-es">{s.tituloEs}</p>
                <p className="admin-servicio-row__desc">{s.descripcion}</p>
              </div>
            </div>

            {/* Acciones */}
            <div className="admin-servicio-row__acciones">
              <button
                onClick={() => setEditando(s)}
                className="admin-btn-secundario"
              >
                Editar
              </button>

              {/* Toggle activo/inactivo */}
              <button
                onClick={() => toggleActivo(s.id, s.activo)}
                className={`admin-toggle ${s.activo ? "admin-toggle--activo" : "admin-toggle--inactivo"}`}
              >
                {s.activo ? "Visible ✓" : "Oculto"}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Modal de edición ─────────────────────────────────────── */}
      {editando && (
        <div className="admin-modal-overlay" onClick={() => setEditando(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__cabecera">
              <h2 className="admin-modal__titulo">Editar servicio</h2>
              <button onClick={() => setEditando(null)} className="admin-modal__cerrar">✕</button>
            </div>
            <div className="admin-modal__cuerpo">
              <div className="campo">
                <label className="campo__etiqueta">Título en inglés (SEO)</label>
                <input
                  type="text"
                  value={editando.tituloEn}
                  onChange={(e) => setEditando({ ...editando, tituloEn: e.target.value })}
                  className="campo__input"
                />
              </div>
              <div className="campo">
                <label className="campo__etiqueta">Título en español</label>
                <input
                  type="text"
                  value={editando.tituloEs}
                  onChange={(e) => setEditando({ ...editando, tituloEs: e.target.value })}
                  className="campo__input"
                />
              </div>
              <div className="campo">
                <label className="campo__etiqueta">Descripción</label>
                <textarea
                  value={editando.descripcion}
                  onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                  rows={3}
                  className="campo__textarea"
                />
              </div>
              <div className="admin-modal__acciones">
                <button onClick={() => setEditando(null)} className="boton-atras">Cancelar</button>
                <button onClick={guardarEdicion} disabled={guardando} className="admin-btn-amarillo">
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}