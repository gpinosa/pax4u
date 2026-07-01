"use client";

/**
 * WizardReserva — Orquestador principal del wizard de 6 pasos
 *
 * Cambios respecto a la versión anterior:
 * - confirmarReserva() ahora guarda la reserva en Firestore
 * - Se añade estado de "guardando" para mostrar feedback al usuario
 * - Se añade manejo de errores si Firestore falla
 *
 * Estructura del documento en Firestore (colección "reservas"):
 * {
 *   numeroReserva: "PAX-260701-4821",
 *   servicio: "aeropuerto-privado",
 *   ruta: { origen, destino, fecha, hora, pasajeros, maletas },
 *   vehiculo: "sedan",
 *   precio: 35,
 *   cliente: { nombre, email, telefono, comentarios },
 *   metodoPago: "tarjeta",
 *   estado: "pendiente",           ← estado inicial siempre
 *   fechaCreacion: Timestamp,      ← generado por Firestore
 *   origenReserva: "web",          ← para distinguir de reservas de partners
 * }
 */

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import IndicadorPasos from "../indicadorPasos";
import Paso4Cliente from "../pasoCliente";
import Paso6Confirmacion from "../pasoConfirmacion";
import Paso5Pago from "../pasoPago";
import Paso2Ruta from "../pasoRuta";
import Paso1Servicio from "../pasoServicio";
import Paso3Vehiculo from "../pasoVehiculo";
import { SlugServicio, EstadoReserva, DetallesRuta, TipoVehiculo, DatosCliente, MetodoPago, VEHICULOS } from "../tipoReserva";


interface Props {
  servicioInicial?: SlugServicio;
}

const ESTADO_INICIAL: EstadoReserva = {
  servicio: null,
  ruta: null,
  vehiculo: null,
  cliente: null,
  metodoPago: null,
};

// Genera el número de reserva con formato PAX-AAMMDD-XXXX
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

const seleccionarVehiculo = (id: string, precio: number) =>
  setReserva((prev) => ({ ...prev, vehiculo: id as TipoVehiculo }));

  const guardarCliente = (datos: DatosCliente) => {
    setReserva((prev) => ({ ...prev, cliente: datos }));
    irAlSiguiente();
  };

  const seleccionarPago = (metodo: MetodoPago) =>
    setReserva((prev) => ({ ...prev, metodoPago: metodo }));

  // ─── Confirmar reserva y guardar en Firestore ─────────────────────────────
  const confirmarReserva = async () => {
    setGuardando(true);
    setErrorGuardado("");

    const numero = generarNumeroReserva();
    const vehiculoInfo = VEHICULOS.find((v) => v.tipo === reserva.vehiculo);

    try {
      // Guardar en la colección "reservas" de Firestore
      await addDoc(collection(db, "reservas"), {
        // Identificador legible para el cliente
        numeroReserva: numero,

        // Datos del servicio y trayecto
        servicio: reserva.servicio,
        ruta: reserva.ruta,
        vehiculo: reserva.vehiculo,
        precio: vehiculoInfo?.precio ?? 0,

        // Datos del cliente
        cliente: reserva.cliente,

        // Pago
        metodoPago: reserva.metodoPago,

        // Estado inicial — el admin lo cambiará a "confirmada"
        estado: "pendiente",

        // Metadatos
        origenReserva: "web",           // distingue de reservas de partners
        fechaCreacion: serverTimestamp(), // timestamp del servidor (más fiable)
      });

      // Éxito — enviar emails de confirmación (no bloqueante)
      fetch("/api/reservas/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroReserva: numero,
          servicio: reserva.servicio,
          ruta: reserva.ruta,
          vehiculo: reserva.vehiculo,
          precio: vehiculoInfo?.precio ?? 0,
          cliente: reserva.cliente,
          metodoPago: reserva.metodoPago,
        }),
      }).catch((err) => console.error("Error al enviar emails:", err));

      // Avanzar al paso 6
      setNumeroReserva(numero);
      irAlSiguiente();

    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      setErrorGuardado(
        "No se pudo guardar la reserva. Comprueba tu conexión e inténtalo de nuevo."
      );
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

  const precioVehiculo =
    VEHICULOS.find((v) => v.tipo === reserva.vehiculo)?.precio ?? 0;

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
            seleccion={reserva.vehiculo}
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
            {/* Error de guardado — se muestra encima del paso 5 */}
            {errorGuardado && (
              <div className="wizard-error">
                ⚠️ {errorGuardado}
              </div>
            )}
            <Paso5Pago
              seleccion={reserva.metodoPago}
              precioTotal={precioVehiculo}
              onSeleccionar={seleccionarPago}
              onConfirmar={confirmarReserva}
              onAtras={irAlAnterior}
              guardando={guardando}
            />
          </>
        )}

        {pasoActual === 6 && (
          <Paso6Confirmacion
            reserva={reserva}
            numeroReserva={numeroReserva}
            onNuevaReserva={reiniciar}
          />
        )}

      </div>
    </div>
  );
}