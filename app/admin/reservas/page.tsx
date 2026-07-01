"use client";

/**
 * app/admin/reservas/page.tsx — Gestión de reservas
 *
 * Cambios:
 * - Añadida columna "Creada" con fecha y hora de la reserva
 * - El timestamp viene de Firestore (fechaCreacion)
 */

import { useEffect, useState } from "react";
import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, Timestamp
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type EstadoReserva = "pendiente" | "confirmada" | "completada" | "cancelada";

interface Reserva {
  id: string;
  cliente: { nombre: string; email: string; telefono: string };
  servicio: string;
  ruta: { origen: string; destino: string; fecha: string; hora: string; pasajeros: number; maletas: number };
  vehiculo: string;
  precio: number;
  estado: EstadoReserva;
  metodoPago: string;
  fechaCreacion: Timestamp;
  numeroReserva: string;
}

const ESTADOS: EstadoReserva[] = ["pendiente", "confirmada", "completada", "cancelada"];

const COLORES_ESTADO: Record<EstadoReserva, string> = {
  pendiente: "admin-badge--amarillo",
  confirmada: "admin-badge--azul",
  completada: "admin-badge--verde",
  cancelada: "admin-badge--rojo",
};

// Formatea un Timestamp de Firestore a "DD/MM/AAAA HH:MM"
function formatearTimestamp(ts: Timestamp | undefined): string {
  if (!ts?.toDate) return "—";
  const fecha = ts.toDate();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anyo = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, "0");
  const min = String(fecha.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${anyo} ${hora}:${min}`;
}

export default function PaginaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [filtroServicio, setFiltroServicio] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [reservaDetalle, setReservaDetalle] = useState<Reserva | null>(null);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "reservas"), orderBy("fechaCreacion", "desc"));
    const cancelar = onSnapshot(q, (snap) => {
      const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Reserva[];
      setReservas(datos);
      setCargando(false);
    });
    return () => cancelar();
  }, []);

  async function cambiarEstado(id: string, nuevoEstado: EstadoReserva) {
    setActualizando(id);
    try {
      await updateDoc(doc(db, "reservas", id), { estado: nuevoEstado });
      if (reservaDetalle?.id === id) {
        setReservaDetalle((prev) => prev ? { ...prev, estado: nuevoEstado } : null);
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado.");
    } finally {
      setActualizando(null);
    }
  }

  const reservasFiltradas = reservas.filter((r) => {
    const coincideEstado = filtroEstado === "todas" || r.estado === filtroEstado;
    const coincideServicio = filtroServicio === "todos" || r.servicio === filtroServicio;
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda =
      !busqueda ||
      r.cliente?.nombre?.toLowerCase().includes(textoBusqueda) ||
      r.cliente?.email?.toLowerCase().includes(textoBusqueda) ||
      r.numeroReserva?.toLowerCase().includes(textoBusqueda);
    return coincideEstado && coincideServicio && coincideBusqueda;
  });

  const serviciosUnicos = [...new Set(reservas.map((r) => r.servicio).filter(Boolean))];

  return (
    <div className="admin-pagina">

      <div className="admin-cabecera">
        <h1 className="admin-titulo">Reservas</h1>
        <span className="admin-contador">{reservasFiltradas.length} reservas</span>
      </div>

      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre, email o nº reserva..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="admin-filtros__busqueda"
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="admin-filtros__select">
          <option value="todas">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>
        <select value={filtroServicio} onChange={(e) => setFiltroServicio(e.target.value)} className="admin-filtros__select">
          <option value="todos">Todos los servicios</option>
          {serviciosUnicos.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {cargando ? (
        <p className="admin-cargando-texto">Cargando reservas...</p>
      ) : reservasFiltradas.length === 0 ? (
        <div className="admin-vacio"><p>No hay reservas con estos filtros.</p></div>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nº Reserva</th>
                <th>Creada</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha viaje</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((r) => (
                <tr key={r.id}>
                  <td><span className="admin-tabla__numero">{r.numeroReserva ?? r.id.slice(0, 8).toUpperCase()}</span></td>
                  {/* Columna nueva: fecha y hora de creación */}
                  <td>
                    <span style={{ fontSize: "0.8rem", color: "#888", whiteSpace: "nowrap" }}>
                      {formatearTimestamp(r.fechaCreacion)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-tabla__cliente">
                      <span className="admin-tabla__nombre">{r.cliente?.nombre ?? "—"}</span>
                      <span className="admin-tabla__email">{r.cliente?.email ?? ""}</span>
                    </div>
                  </td>
                  <td>{r.servicio ?? "—"}</td>
                  <td>{r.ruta?.fecha ?? "—"} {r.ruta?.hora ?? ""}</td>
                  <td>{r.precio ? `${r.precio}€` : "—"}</td>
                  <td>
                    <select
                      value={r.estado}
                      onChange={(e) => cambiarEstado(r.id, e.target.value as EstadoReserva)}
                      disabled={actualizando === r.id}
                      className={`admin-estado-select admin-badge ${COLORES_ESTADO[r.estado] ?? ""}`}
                    >
                      {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setReservaDetalle(r)} className="admin-tabla__ver">Ver detalle →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalle */}
      {reservaDetalle && (
        <div className="admin-modal-overlay" onClick={() => setReservaDetalle(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__cabecera">
              <h2 className="admin-modal__titulo">
                Reserva {reservaDetalle.numeroReserva ?? reservaDetalle.id.slice(0, 8)}
              </h2>
              <button onClick={() => setReservaDetalle(null)} className="admin-modal__cerrar">✕</button>
            </div>
            <div className="admin-modal__cuerpo">
              <div className="admin-modal__seccion">
                <h3>Estado</h3>
                <div className="admin-modal__estado-wrap">
                  {ESTADOS.map((estado) => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstado(reservaDetalle.id, estado)}
                      className={`admin-modal__estado-btn ${reservaDetalle.estado === estado ? "admin-modal__estado-btn--activo" : ""}`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>
              <div className="admin-modal__seccion">
                <h3>Creada el</h3>
                <div className="admin-modal__fila">
                  <span>Fecha y hora</span>
                  <span>{formatearTimestamp(reservaDetalle.fechaCreacion)}</span>
                </div>
              </div>
              <div className="admin-modal__seccion">
                <h3>Cliente</h3>
                <div className="admin-modal__fila"><span>Nombre</span><span>{reservaDetalle.cliente?.nombre}</span></div>
                <div className="admin-modal__fila"><span>Email</span><a href={`mailto:${reservaDetalle.cliente?.email}`}>{reservaDetalle.cliente?.email}</a></div>
                <div className="admin-modal__fila"><span>Teléfono</span><a href={`tel:${reservaDetalle.cliente?.telefono}`}>{reservaDetalle.cliente?.telefono}</a></div>
              </div>
              <div className="admin-modal__seccion">
                <h3>Trayecto</h3>
                <div className="admin-modal__fila"><span>Servicio</span><span>{reservaDetalle.servicio}</span></div>
                <div className="admin-modal__fila"><span>Origen</span><span>{reservaDetalle.ruta?.origen}</span></div>
                <div className="admin-modal__fila"><span>Destino</span><span>{reservaDetalle.ruta?.destino}</span></div>
                <div className="admin-modal__fila"><span>Fecha</span><span>{reservaDetalle.ruta?.fecha} a las {reservaDetalle.ruta?.hora}</span></div>
                <div className="admin-modal__fila"><span>Pasajeros</span><span>{reservaDetalle.ruta?.pasajeros}</span></div>
                <div className="admin-modal__fila"><span>Maletas</span><span>{reservaDetalle.ruta?.maletas}</span></div>
              </div>
              <div className="admin-modal__seccion">
                <h3>Pago</h3>
                <div className="admin-modal__fila"><span>Vehículo</span><span>{reservaDetalle.vehiculo}</span></div>
                <div className="admin-modal__fila"><span>Método</span><span>{reservaDetalle.metodoPago}</span></div>
                <div className="admin-modal__fila admin-modal__fila--total"><span>Total</span><span>{reservaDetalle.precio}€</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}