"use client";

/**
 * app/admin/partners/page.tsx — Gestión de partners y hoteles
 *
 * Permite:
 * - Ver todos los partners registrados
 * - Crear nuevos partners (hoteles, agencias)
 * - Activar / desactivar acceso de partners
 * - Ver las reservas generadas por cada partner
 *
 * Cada partner tiene acceso limitado al panel:
 * solo puede crear y ver sus propias reservas.
 *
 * En Fase 2: el partner tendrá su propio login en /partner
 */

import { useEffect, useState } from "react";
import {
  collection, onSnapshot, doc, updateDoc,
  addDoc, Timestamp
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// ─── Tipo partner ─────────────────────────────────────────────────────────────
interface Partner {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: "hotel" | "agencia" | "empresa" | "otro";
  activo: boolean;
  codigoPartner: string;
  totalReservas: number;
  fechaAlta: Timestamp;
  notas: string;
}

// Genera un código único de partner
function generarCodigo(nombre: string): string {
  const base = nombre.toUpperCase().replace(/\s+/g, "").slice(0, 4);
  const num = Math.floor(Math.random() * 900 + 100);
  return `${base}${num}`;
}

export default function PaginaPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Formulario nuevo partner
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState<Partner["tipo"]>("hotel");
  const [nuevoNotas, setNuevoNotas] = useState("");

  // ─── Cargar partners en tiempo real ────────────────────────────────────
  useEffect(() => {
    const cancelar = onSnapshot(collection(db, "partners"), (snap) => {
      const datos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Partner));
      setPartners(datos);
      setCargando(false);
    });
    return () => cancelar();
  }, []);

  // ─── Crear nuevo partner ───────────────────────────────────────────────
  async function crearPartner() {
    if (!nuevoNombre.trim() || !nuevoEmail.trim()) {
      alert("Nombre y email son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      await addDoc(collection(db, "partners"), {
        nombre: nuevoNombre.trim(),
        email: nuevoEmail.trim(),
        telefono: nuevoTelefono.trim(),
        tipo: nuevoTipo,
        activo: true,
        codigoPartner: generarCodigo(nuevoNombre),
        totalReservas: 0,
        fechaAlta: Timestamp.now(),
        notas: nuevoNotas.trim(),
      });
      // Resetear formulario
      setNuevoNombre(""); setNuevoEmail(""); setNuevoTelefono("");
      setNuevoTipo("hotel"); setNuevoNotas("");
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al crear partner:", error);
      alert("Error al crear el partner. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  // ─── Activar / desactivar partner ──────────────────────────────────────
  async function togglePartner(id: string, activo: boolean) {
    await updateDoc(doc(db, "partners", id), { activo: !activo });
  }

  const ICONOS_TIPO: Record<Partner["tipo"], string> = {
    hotel: "🏨", agencia: "✈️", empresa: "🏢", otro: "🤝"
  };

  return (
    <div className="admin-pagina">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="admin-cabecera">
        <h1 className="admin-titulo">Partners</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="admin-btn-amarillo"
        >
          + Nuevo partner
        </button>
      </div>

      {/* ── Estadísticas ─────────────────────────────────────────── */}
      <div className="admin-metricas">
        <div className="admin-metrica admin-metrica--gris">
          <span className="admin-metrica__icono">🤝</span>
          <div>
            <p className="admin-metrica__label">Total partners</p>
            <p className="admin-metrica__valor">{partners.length}</p>
          </div>
        </div>
        <div className="admin-metrica admin-metrica--verde">
          <span className="admin-metrica__icono">✓</span>
          <div>
            <p className="admin-metrica__label">Activos</p>
            <p className="admin-metrica__valor">{partners.filter((p) => p.activo).length}</p>
          </div>
        </div>
        <div className="admin-metrica admin-metrica--azul">
          <span className="admin-metrica__icono">📋</span>
          <div>
            <p className="admin-metrica__label">Reservas via partners</p>
            <p className="admin-metrica__valor">
              {partners.reduce((sum, p) => sum + (p.totalReservas ?? 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Lista de partners ─────────────────────────────────────── */}
      {cargando ? (
        <p className="admin-cargando-texto">Cargando partners...</p>
      ) : partners.length === 0 ? (
        <div className="admin-vacio">
          <p>No hay partners todavía.</p>
          <p className="admin-vacio__sub">Crea el primer partner con el botón de arriba.</p>
          <button onClick={() => setMostrarFormulario(true)} className="admin-btn-amarillo">
            + Añadir primer partner
          </button>
        </div>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Tipo</th>
                <th>Código</th>
                <th>Email</th>
                <th>Reservas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-tabla__cliente">
                      <span className="admin-tabla__nombre">{p.nombre}</span>
                      <span className="admin-tabla__email">{p.telefono}</span>
                    </div>
                  </td>
                  <td>
                    {ICONOS_TIPO[p.tipo]} {p.tipo}
                  </td>
                  <td>
                    <code className="admin-codigo">{p.codigoPartner}</code>
                  </td>
                  <td>
                    <a href={`mailto:${p.email}`} className="admin-tabla__email-link">
                      {p.email}
                    </a>
                  </td>
                  <td>{p.totalReservas ?? 0}</td>
                  <td>
                    <span className={`admin-badge ${p.activo ? "admin-badge--verde" : "admin-badge--rojo"}`}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => togglePartner(p.id, p.activo)}
                      className="admin-btn-secundario"
                    >
                      {p.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal: nuevo partner ──────────────────────────────────── */}
      {mostrarFormulario && (
        <div className="admin-modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__cabecera">
              <h2 className="admin-modal__titulo">Nuevo partner</h2>
              <button onClick={() => setMostrarFormulario(false)} className="admin-modal__cerrar">✕</button>
            </div>
            <div className="admin-modal__cuerpo">
              <div className="formulario">
                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Nombre <span className="campo__requerido">*</span></label>
                    <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} placeholder="Hotel Arts Barcelona" className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Tipo</label>
                    <select value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value as Partner["tipo"])} className="campo__input">
                      <option value="hotel">Hotel</option>
                      <option value="agencia">Agencia de viajes</option>
                      <option value="empresa">Empresa</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="formulario__fila">
                  <div className="campo">
                    <label className="campo__etiqueta">Email <span className="campo__requerido">*</span></label>
                    <input type="email" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} placeholder="contacto@hotel.com" className="campo__input" />
                  </div>
                  <div className="campo">
                    <label className="campo__etiqueta">Teléfono</label>
                    <input type="tel" value={nuevoTelefono} onChange={(e) => setNuevoTelefono(e.target.value)} placeholder="+34 93 000 0000" className="campo__input" />
                  </div>
                </div>
                <div className="campo">
                  <label className="campo__etiqueta">Notas internas <span className="campo__opcional">(opcional)</span></label>
                  <textarea value={nuevoNotas} onChange={(e) => setNuevoNotas(e.target.value)} placeholder="Condiciones especiales, persona de contacto..." rows={3} className="campo__textarea" />
                </div>
              </div>
              <div className="admin-modal__acciones">
                <button onClick={() => setMostrarFormulario(false)} className="boton-atras">Cancelar</button>
                <button onClick={crearPartner} disabled={guardando} className="admin-btn-amarillo">
                  {guardando ? "Creando..." : "Crear partner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}