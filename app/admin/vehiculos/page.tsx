"use client";

/**
 * app/admin/vehiculos/page.tsx — Gestión de vehículos desde el panel
 *
 * Permite crear, editar, activar/desactivar vehículos sin tocar el código.
 * Los vehículos se guardan en Firestore → colección "vehiculos".
 *
 * El wizard de reserva lee los vehículos desde Firestore en tiempo real,
 * por lo que cualquier cambio aquí se refleja inmediatamente en la web.
 *
 * Campos de cada vehículo:
 * - nombre: nombre visible al cliente
 * - descripcion: texto descriptivo
 * - icono: emoji del vehículo
 * - capacidadPasajeros: máximo de pasajeros
 * - capacidadMaletas: máximo de maletas
 * - precio: precio base en euros
 * - activo: si aparece o no en el wizard
 * - orden: posición en la lista
 */

import { useEffect, useState } from "react";
import {
  collection, onSnapshot, doc,
  updateDoc, addDoc, deleteDoc, orderBy, query
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface Vehiculo {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  capacidadPasajeros: number;
  capacidadMaletas: number;
  precio: number;
  activo: boolean;
  orden: number;
}

const VEHICULO_VACIO = {
  nombre: "",
  descripcion: "",
  icono: "🚗",
  capacidadPasajeros: 4,
  capacidadMaletas: 3,
  precio: 35,
  activo: true,
  orden: 99,
};

// Emojis rápidos para elegir icono
const ICONOS = ["🚗", "🚐", "🚌", "🚑", "🚒", "🏎️", "🚕", "🛻", "🚙"];

export default function PaginaVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Vehiculo | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Formulario
  const [form, setForm] = useState(VEHICULO_VACIO);

  // ─── Cargar vehículos desde Firestore ──────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, "vehiculos"), orderBy("orden", "asc"));
    const cancelar = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        // Primera vez: inicializar con los 3 vehículos por defecto
        await inicializarVehiculos();
      } else {
        setVehiculos(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vehiculo)));
        setCargando(false);
      }
    });
    return () => cancelar();
  }, []);

  // ─── Inicializar vehículos por defecto (solo la primera vez) ───────────
  async function inicializarVehiculos() {
    const defaults = [
      { nombre: "Sedán Privado", descripcion: "Ideal para 1–3 pasajeros con equipaje de mano.", icono: "🚗", capacidadPasajeros: 3, capacidadMaletas: 2, precio: 35, activo: true, orden: 1 },
      { nombre: "Minivan", descripcion: "Perfecto para familias o grupos de hasta 6 personas.", icono: "🚐", capacidadPasajeros: 6, capacidadMaletas: 5, precio: 55, activo: true, orden: 2 },
      { nombre: "Van / Furgoneta", descripcion: "Para grupos grandes o mucho equipaje. Hasta 8 pasajeros.", icono: "🚌", capacidadPasajeros: 8, capacidadMaletas: 8, precio: 80, activo: true, orden: 3 },
    ];
    for (const v of defaults) {
      await addDoc(collection(db, "vehiculos"), v);
    }
  }

  // ─── Abrir formulario nuevo ─────────────────────────────────────────────
  function abrirNuevo() {
    setForm({ ...VEHICULO_VACIO, orden: vehiculos.length + 1 });
    setEditando(null);
    setMostrarFormulario(true);
  }

  // ─── Abrir formulario edición ───────────────────────────────────────────
  function abrirEdicion(v: Vehiculo) {
    setForm({
      nombre: v.nombre,
      descripcion: v.descripcion,
      icono: v.icono,
      capacidadPasajeros: v.capacidadPasajeros,
      capacidadMaletas: v.capacidadMaletas,
      precio: v.precio,
      activo: v.activo,
      orden: v.orden,
    });
    setEditando(v);
    setMostrarFormulario(true);
  }

  // ─── Guardar (crear o editar) ───────────────────────────────────────────
  async function guardar() {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio."); return; }
    if (form.precio <= 0) { alert("El precio debe ser mayor que 0."); return; }
    setGuardando(true);
    try {
      if (editando) {
        await updateDoc(doc(db, "vehiculos", editando.id), { ...form });
      } else {
        await addDoc(collection(db, "vehiculos"), { ...form });
      }
      setMostrarFormulario(false);
      setEditando(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  // ─── Activar / desactivar ───────────────────────────────────────────────
  async function toggleActivo(id: string, activo: boolean) {
    await updateDoc(doc(db, "vehiculos", id), { activo: !activo });
  }

  // ─── Eliminar vehículo ──────────────────────────────────────────────────
  async function eliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar el vehículo "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await deleteDoc(doc(db, "vehiculos", id));
  }

  const cerrarFormulario = () => { setMostrarFormulario(false); setEditando(null); };

  if (cargando) return <div className="admin-pagina"><p className="admin-cargando-texto">Cargando vehículos...</p></div>;

  return (
    <div className="admin-pagina">

      {/* Cabecera */}
      <div className="admin-cabecera">
        <div>
          <h1 className="admin-titulo">Vehículos</h1>
          <p className="admin-cabecera__desc">
            Los cambios se reflejan inmediatamente en el wizard de reserva.
          </p>
        </div>
        <button onClick={abrirNuevo} className="admin-btn-amarillo">
          + Nuevo vehículo
        </button>
      </div>

      {/* Métricas rápidas */}
      <div className="admin-metricas" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-metrica admin-metrica--gris">
          <span className="admin-metrica__icono">🚗</span>
          <div><p className="admin-metrica__label">Total vehículos</p><p className="admin-metrica__valor">{vehiculos.length}</p></div>
        </div>
        <div className="admin-metrica admin-metrica--verde">
          <span className="admin-metrica__icono">✓</span>
          <div><p className="admin-metrica__label">Activos</p><p className="admin-metrica__valor">{vehiculos.filter(v => v.activo).length}</p></div>
        </div>
        <div className="admin-metrica admin-metrica--amarillo">
          <span className="admin-metrica__icono">💶</span>
          <div><p className="admin-metrica__label">Precio mínimo</p><p className="admin-metrica__valor">{Math.min(...vehiculos.map(v => v.precio))}€</p></div>
        </div>
      </div>

      {/* Lista de vehículos */}
      {vehiculos.length === 0 ? (
        <div className="admin-vacio">
          <p>No hay vehículos. Crea el primero.</p>
          <button onClick={abrirNuevo} className="admin-btn-amarillo">+ Añadir vehículo</button>
        </div>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Capacidad</th>
                <th>Precio base</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="admin-tabla__cliente">
                      <span className="admin-tabla__nombre">{v.icono} {v.nombre}</span>
                      <span className="admin-tabla__email">{v.descripcion}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                      👤 {v.capacidadPasajeros} pax &nbsp; 🧳 {v.capacidadMaletas} maletas
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>{v.precio}€</span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>#{v.orden}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${v.activo ? "admin-badge--verde" : "admin-badge--rojo"}`}>
                      {v.activo ? "Visible" : "Oculto"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => abrirEdicion(v)} className="admin-btn-secundario">Editar</button>
                      <button
                        onClick={() => toggleActivo(v.id, v.activo)}
                        className={`admin-toggle ${v.activo ? "admin-toggle--activo" : "admin-toggle--inactivo"}`}
                      >
                        {v.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => eliminar(v.id, v.nombre)}
                        style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal formulario */}
      {mostrarFormulario && (
        <div className="admin-modal-overlay" onClick={cerrarFormulario}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__cabecera">
              <h2 className="admin-modal__titulo">{editando ? "Editar vehículo" : "Nuevo vehículo"}</h2>
              <button onClick={cerrarFormulario} className="admin-modal__cerrar">✕</button>
            </div>
            <div className="admin-modal__cuerpo">
              <div className="formulario">

                {/* Icono */}
                <div className="campo">
                  <label className="campo__etiqueta">Icono</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {ICONOS.map((ico) => (
                      <button
                        key={ico}
                        type="button"
                        onClick={() => setForm({ ...form, icono: ico })}
                        style={{
                          fontSize: "1.5rem", padding: "6px 10px", border: "1.5px solid",
                          borderColor: form.icono === ico ? "#F7C600" : "#e0e0e0",
                          borderRadius: "8px", background: form.icono === ico ? "rgba(247,198,0,0.1)" : "#fff",
                          cursor: "pointer"
                        }}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nombre */}
                <div className="campo">
                  <label className="campo__etiqueta">Nombre <span className="campo__requerido">*</span></label>
                  <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Minivan Premium" className="campo__input" />
                </div>

                {/* Descripción */}
                <div className="campo">
                  <label className="campo__etiqueta">Descripción</label>
                  <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Ideal para grupos de hasta 6 personas" className="campo__input" />
                </div>

                {/* Capacidades y precio */}
                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Máx. pasajeros</label>
                    <input type="number" min="1" max="20" value={form.capacidadPasajeros} onChange={(e) => setForm({ ...form, capacidadPasajeros: Number(e.target.value) })} className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Máx. maletas</label>
                    <input type="number" min="0" max="20" value={form.capacidadMaletas} onChange={(e) => setForm({ ...form, capacidadMaletas: Number(e.target.value) })} className="campo__input" />
                  </div>
                </div>

                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Precio base (€) <span className="campo__requerido">*</span></label>
                    <input type="number" min="1" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Orden en la lista</label>
                    <input type="number" min="1" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} className="campo__input" />
                  </div>
                </div>

                {/* Activo */}
                <div className="campo" style={{ flexDirection: "row", alignItems: "center", gap: "12px" }}>
                  <input
                    type="checkbox"
                    id="activo"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="activo" className="campo__etiqueta" style={{ cursor: "pointer", margin: 0 }}>
                    Visible en el wizard de reserva
                  </label>
                </div>

              </div>

              <div className="admin-modal__acciones">
                <button onClick={cerrarFormulario} className="boton-atras">Cancelar</button>
                <button onClick={guardar} disabled={guardando} className="admin-btn-amarillo">
                  {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear vehículo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}