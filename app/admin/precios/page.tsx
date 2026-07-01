"use client";

/**
 * app/admin/precios/page.tsx — Gestión de precios
 *
 * Permite editar los precios de cada vehículo y servicio.
 * Los precios se guardan en Firestore → colección "configuracion"
 * → documento "precios".
 *
 * Cuando el wizard de reserva cargue los precios, los leerá
 * desde Firestore en lugar de los valores hardcodeados.
 * (Conectar en Fase 2 en tipos-reserva.ts)
 */

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface PreciosVehiculo {
  sedan: number;
  minivan: number;
  van: number;
}

interface ConfigPrecios {
  vehiculos: PreciosVehiculo;
  extras: {
    maletaExtra: number;
    asientoBebe: number;
    esperaAeropuerto: number;
  };
  ultimaActualizacion?: string;
}

// Precios por defecto si no hay nada en Firestore
const PRECIOS_DEFAULT: ConfigPrecios = {
  vehiculos: { sedan: 35, minivan: 55, van: 80 },
  extras: { maletaExtra: 5, asientoBebe: 10, esperaAeropuerto: 15 },
};

export default function PaginaPrecios() {
  const [precios, setPrecios] = useState<ConfigPrecios>(PRECIOS_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // ─── Cargar precios actuales desde Firestore ──────────────────────────
  useEffect(() => {
    async function cargarPrecios() {
      try {
        const ref = doc(db, "configuracion", "precios");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPrecios(snap.data() as ConfigPrecios);
        }
      } catch (error) {
        console.error("Error al cargar precios:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarPrecios();
  }, []);

  // ─── Guardar precios en Firestore ─────────────────────────────────────
  async function guardarPrecios() {
    setGuardando(true);
    try {
      await setDoc(doc(db, "configuracion", "precios"), {
        ...precios,
        ultimaActualizacion: new Date().toISOString(),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (error) {
      console.error("Error al guardar precios:", error);
      alert("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  // Helper para actualizar un precio anidado
  function actualizarVehiculo(campo: keyof PreciosVehiculo, valor: number) {
    setPrecios((prev) => ({
      ...prev,
      vehiculos: { ...prev.vehiculos, [campo]: valor },
    }));
  }

  function actualizarExtra(campo: keyof ConfigPrecios["extras"], valor: number) {
    setPrecios((prev) => ({
      ...prev,
      extras: { ...prev.extras, [campo]: valor },
    }));
  }

  if (cargando) {
    return <div className="admin-pagina"><p className="admin-cargando-texto">Cargando precios...</p></div>;
  }

  return (
    <div className="admin-pagina">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="admin-cabecera">
        <h1 className="admin-titulo">Precios</h1>
        <button
          onClick={guardarPrecios}
          disabled={guardando}
          className="admin-btn-amarillo"
        >
          {guardando ? "Guardando..." : guardado ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>

      {guardado && (
        <div className="admin-alerta-exito">
          ✓ Precios actualizados correctamente. Se aplicarán en la próxima reserva.
        </div>
      )}

      {/* ── Precios por vehículo ──────────────────────────────────── */}
      <div className="admin-seccion">
        <h2 className="admin-seccion__titulo">Precios base por vehículo</h2>
        <p className="admin-seccion__desc">
          Precio mínimo desde el que se calcula cada trayecto.
          En Fase 2 se multiplicará por los km de la ruta.
        </p>

        <div className="admin-precios-grid">
          {[
            { key: "sedan" as const, icono: "🚗", nombre: "Sedán privado", capacidad: "Hasta 3 pax" },
            { key: "minivan" as const, icono: "🚐", nombre: "Minivan", capacidad: "Hasta 6 pax" },
            { key: "van" as const, icono: "🚌", nombre: "Van / Furgoneta", capacidad: "Hasta 8 pax" },
          ].map((v) => (
            <div key={v.key} className="admin-precio-card">
              <div className="admin-precio-card__icono">{v.icono}</div>
              <div className="admin-precio-card__info">
                <span className="admin-precio-card__nombre">{v.nombre}</span>
                <span className="admin-precio-card__cap">{v.capacidad}</span>
              </div>
              <div className="admin-precio-card__input-wrap">
                <input
                  type="number"
                  min="0"
                  value={precios.vehiculos[v.key]}
                  onChange={(e) => actualizarVehiculo(v.key, Number(e.target.value))}
                  className="admin-precio-input"
                />
                <span className="admin-precio-card__euro">€</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extras ───────────────────────────────────────────────── */}
      <div className="admin-seccion">
        <h2 className="admin-seccion__titulo">Extras</h2>
        <p className="admin-seccion__desc">
          Cargos adicionales opcionales que el cliente puede añadir.
        </p>

        <div className="admin-precios-grid">
          {[
            { key: "maletaExtra" as const, icono: "🧳", nombre: "Maleta extra grande" },
            { key: "asientoBebe" as const, icono: "👶", nombre: "Asiento para bebé" },
            { key: "esperaAeropuerto" as const, icono: "⏱️", nombre: "Espera en aeropuerto (por hora)" },
          ].map((extra) => (
            <div key={extra.key} className="admin-precio-card">
              <div className="admin-precio-card__icono">{extra.icono}</div>
              <div className="admin-precio-card__info">
                <span className="admin-precio-card__nombre">{extra.nombre}</span>
              </div>
              <div className="admin-precio-card__input-wrap">
                <input
                  type="number"
                  min="0"
                  value={precios.extras[extra.key]}
                  onChange={(e) => actualizarExtra(extra.key, Number(e.target.value))}
                  className="admin-precio-input"
                />
                <span className="admin-precio-card__euro">€</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {precios.ultimaActualizacion && (
        <p className="admin-ultima-actualizacion">
          Última actualización: {new Date(precios.ultimaActualizacion).toLocaleString("es-ES")}
        </p>
      )}

    </div>
  );
}