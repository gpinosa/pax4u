"use client";

/**
 * pasoVehiculo.tsx — Paso 3 del wizard de reserva
 *
 * Cambio clave: los vehículos ya no vienen de un array hardcodeado
 * sino de Firestore (colección "vehiculos"), igual que el panel admin.
 *
 * Esto significa que cualquier cambio en el panel de admin
 * (nuevo vehículo, precio actualizado, desactivar un vehículo)
 * se refleja inmediatamente en el wizard sin tocar el código.
 */

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// ─── Tipo de vehículo (igual que en Firestore) ────────────────────────────────
interface VehiculoFirestore {
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

interface Props {
  pasajeros: number;
  maletas: number;
  seleccion: string | null;
  onSeleccionar: (id: string, precio: number) => void;
  onSiguiente: () => void;
  onAtras: () => void;
}

export default function Paso3Vehiculo({
  pasajeros,
  maletas,
  seleccion,
  onSeleccionar,
  onSiguiente,
  onAtras,
}: Props) {
  const [vehiculos, setVehiculos] = useState<VehiculoFirestore[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar vehículos activos desde Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, "vehiculos"), orderBy("orden", "asc"));
    const cancelar = onSnapshot(q, (snap) => {
      const todos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as VehiculoFirestore));
      setVehiculos(todos);
      setCargando(false);
    });
    return () => cancelar();
  }, []);

  // Filtrar: solo activos y con capacidad suficiente
  const disponibles = vehiculos.filter(
    (v) => v.activo && v.capacidadPasajeros >= pasajeros && v.capacidadMaletas >= maletas
  );

  return (
    <div className="paso-wizard">
      <div className="paso-wizard__cabecera">
        <h2 className="paso-wizard__titulo">Elige tu vehículo</h2>
        <p className="paso-wizard__subtitulo">
          Mostramos solo los vehículos con capacidad para {pasajeros}{" "}
          {pasajeros === 1 ? "pasajero" : "pasajeros"} y {maletas}{" "}
          {maletas === 1 ? "maleta" : "maletas"}.
        </p>
      </div>

      {cargando ? (
        <p className="admin-cargando-texto">Cargando vehículos...</p>
      ) : disponibles.length === 0 ? (
        <div className="admin-vacio">
          <p>No hay vehículos disponibles para {pasajeros} pasajeros y {maletas} maletas.</p>
          <p className="admin-vacio__sub">Contacta con nosotros para opciones personalizadas.</p>
        </div>
      ) : (
        <div className="paso3__vehiculos">
          {disponibles.map((v) => {
            const estaSeleccionado = seleccion === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSeleccionar(v.id, v.precio)}
                className={`vehiculo-card ${estaSeleccionado ? "vehiculo-card--activa" : ""}`}
                aria-pressed={estaSeleccionado}
              >
                {estaSeleccionado && (
                  <span className="vehiculo-card__badge">Seleccionado ✓</span>
                )}
                <span className="vehiculo-card__icono" aria-hidden="true">{v.icono}</span>
                <h3 className="vehiculo-card__nombre">{v.nombre}</h3>
                <p className="vehiculo-card__descripcion">{v.descripcion}</p>
                <div className="vehiculo-card__capacidad">
                  <span>👤 {v.capacidadPasajeros} pasajeros</span>
                  <span>🧳 {v.capacidadMaletas} maletas</span>
                </div>
                <div className="vehiculo-card__precio">
                  <span className="vehiculo-card__precio-desde">Desde</span>
                  <span className="vehiculo-card__precio-valor">{v.precio}€</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <p className="paso3__aviso">💡 Precio fijo — sin taxímetro, sin sorpresas al llegar.</p>

      <div className="paso-wizard__acciones paso-wizard__acciones--doble">
        <button type="button" onClick={onAtras} className="boton-atras">← Atrás</button>
        <button
          type="button"
          onClick={onSiguiente}
          disabled={!seleccion}
          className="boton-siguiente"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}