"use client";

/**
 * reserva.tsx — Orquestador principal del wizard de 6 pasos
 *
 * Cambios en esta versión:
 * - El vehículo ya no es un TipoVehiculo fijo sino el ID de Firestore
 * - El precio se guarda por separado al seleccionar el vehículo
 * - Llama a /api/reservas/confirmar para emails tras guardar en Firestore
 */

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import IndicadorPasos from "./indicadorPasos";
import Paso4Cliente from "./pasoCliente";
import Paso6Confirmacion from "./pasoConfirmacion";
import Paso5Pago from "./pasoPago";
import Paso2Ruta from "./pasoRuta";
import Paso1Servicio from "./pasoServicio";
import Paso3Vehiculo from "./pasoVehiculo";
import {
  SlugServicio,
  DetallesRuta,
  DatosCliente,
  MetodoPago,
} from "./tipoReserva";

interface Props {
  servicioInicial?: SlugServicio;
}

interface EstadoReserva {
  servicio: SlugServicio | null;
  ruta: DetallesRuta | null;
  vehiculoId: string | null;    // ID del documento en Firestore
  vehiculoPrecio: number;        // Precio del vehículo seleccionado
  cliente: DatosCliente | null;
  metodoPago: MetodoPago | null;
}

const ESTADO_INICIAL: EstadoReserva = {
  servicio: null,
  ruta: null,
  vehiculoId: null,
  vehiculoPrecio: 0,
  cliente: null,
  metodoPago: null,
};

function generarNumeroReserva(): string {
  const fecha = new Date();
  const anyo = fecha.getFullYear().toString().slice(-2);
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const aleatorio = Math.floor(Math.random() * 9000 + 1000);
  return `PAX-${anyo}${mes}${dia}-${aleatorio}`;
}

export default function WizardReserva({ servicioInicial }: Props) {
  const [pasoActual, setPasoActual] = useState(1);
  const [reserva, setReserva] = useState<EstadoReserva>({
    ...ESTADO_INICIAL,
    servicio: servicioInicial ?? null,
  });
  const [numeroReserva, setNumeroReserva] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");

  const irAlSiguiente = () => setPasoActual((prev) => Math.min(prev + 1, 6));
  const irAlAnterior = () => setPasoActual((prev) => Math.max(prev - 1, 1));

  const seleccionarServicio = (slug: SlugServicio) =>
    setReserva((prev) => ({ ...prev, servicio: slug }));

  const guardarRuta = (datos: DetallesRuta) => {
    setReserva((prev) => ({ ...prev, ruta: datos }));
    irAlSiguiente();
  };

  // Recibe ID de Firestore + precio del vehículo elegido
  const seleccionarVehiculo = (id: string, precio: number) =>
    setReserva((prev) => ({ ...prev, vehiculoId: id, vehiculoPrecio: precio }));

  const guardarCliente = (datos: DatosCliente) => {
    setReserva((prev) => ({ ...prev, cliente: datos }));
    irAlSiguiente();
  };

  const seleccionarPago = (metodo: MetodoPago) =>
    setReserva((prev) => ({ ...prev, metodoPago: metodo }));

  // ─── Confirmar: Firestore + emails ────────────────────────────────────────
  const confirmarReserva = async () => {
    setGuardando(true);
    setErrorGuardado("");
    const numero = generarNumeroReserva();

    try {
      // 1. Guardar en Firestore
      await addDoc(collection(db, "reservas"), {
        numeroReserva: numero,
        servicio: reserva.servicio,
        ruta: reserva.ruta,
        vehiculoId: reserva.vehiculoId,
        precio: reserva.vehiculoPrecio,
        cliente: reserva.cliente,
        metodoPago: reserva.metodoPago,
        estado: "pendiente",
        origenReserva: "web",
        fechaCreacion: serverTimestamp(),
      });

      // 2. Enviar emails (no bloqueante)
      fetch("/api/reservas/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroReserva: numero,
          servicio: reserva.servicio,
          ruta: reserva.ruta,
          vehiculo: reserva.vehiculoId,
          precio: reserva.vehiculoPrecio,
          cliente: reserva.cliente,
          metodoPago: reserva.metodoPago,
        }),
      }).catch((err) => console.error("Error al enviar emails:", err));

      // 3. Avanzar al paso 6
      setNumeroReserva(numero);
      irAlSiguiente();

    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      setErrorGuardado("No se pudo guardar la reserva. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const reiniciar = () => {
    setReserva(ESTADO_INICIAL);
    setNumeroReserva("");
    setErrorGuardado("");
    setPasoActual(1);
  };

  return (
    <div className="wizard-reserva">
      {pasoActual < 6 && <IndicadorPasos pasoActual={pasoActual} />}

      <div className="wizard-reserva__contenido">
        {pasoActual === 1 && (
          <Paso1Servicio
            seleccion={reserva.servicio}
            onSeleccionar={seleccionarServicio}
            onSiguiente={irAlSiguiente}
          />
        )}
        {pasoActual === 2 && (
          <Paso2Ruta
            datos={reserva.ruta}
            onGuardar={guardarRuta}
            onAtras={irAlAnterior}
          />
        )}
        {pasoActual === 3 && (
          <Paso3Vehiculo
            pasajeros={reserva.ruta?.pasajeros ?? 1}
            maletas={reserva.ruta?.maletas ?? 0}
            seleccion={reserva.vehiculoId}
            onSeleccionar={seleccionarVehiculo}
            onSiguiente={irAlSiguiente}
            onAtras={irAlAnterior}
          />
        )}
        {pasoActual === 4 && (
          <Paso4Cliente
            datos={reserva.cliente}
            onGuardar={guardarCliente}
            onAtras={irAlAnterior}
          />
        )}
        {pasoActual === 5 && (
          <>
            {errorGuardado && <div className="wizard-error">⚠️ {errorGuardado}</div>}
            <Paso5Pago
              seleccion={reserva.metodoPago}
              precioTotal={reserva.vehiculoPrecio}
              onSeleccionar={seleccionarPago}
              onConfirmar={confirmarReserva}
              onAtras={irAlAnterior}
              guardando={guardando}
            />
          </>
        )}
        {pasoActual === 6 && (
          <Paso6Confirmacion
            reserva={{ ...reserva, vehiculo: reserva.vehiculoId, cliente: reserva.cliente }}
            numeroReserva={numeroReserva}
            onNuevaReserva={reiniciar}
          />
        )}
      </div>
    </div>
  );
}