"use client";

/**
 * Paso6Confirmacion — Paso 6 (final) del wizard de reserva
 *
 * Muestra el resumen completo de la reserva una vez confirmada.
 *
 * En Fase 1:
 * - Se genera un número de reserva local (provisional)
 * - Se muestra el resumen de todos los pasos
 * - El email de confirmación se enviará desde el backend
 *
 * En Fase 2:
 * - El número de reserva vendrá del backend (respuesta de la API)
 * - Se mostrará el estado del pago en tiempo real (Stripe webhook)
 * - El email se enviará automáticamente desde el servidor
 *
 * Props:
 * - reserva: estado completo de la reserva (todos los pasos)
 * - numeroReserva: código generado por el backend (o provisional)
 * - onNuevaReserva: callback para reiniciar el wizard
 */

import {
  EstadoReserva,
  OPCIONES_SERVICIO,
  VEHICULOS,
} from "./tipoReserva";

interface Props {
  reserva: EstadoReserva;
  numeroReserva: string;
  onNuevaReserva: () => void;
}

// Formatea una fecha ISO "YYYY-MM-DD" a "DD/MM/YYYY"
function formatearFecha(fechaIso: string): string {
  const [anyo, mes, dia] = fechaIso.split("-");
  return `${dia}/${mes}/${anyo}`;
}

export default function Paso6Confirmacion({
  reserva,
  numeroReserva,
  onNuevaReserva,
}: Props) {
  // Buscar los objetos completos a partir de los slugs guardados
  const servicioInfo = OPCIONES_SERVICIO.find((s) => s.slug === reserva.servicio);
  const vehiculoInfo = VEHICULOS.find((v) => v.tipo === reserva.vehiculo);

  const etiquetaMetodoPago: Record<string, string> = {
    tarjeta: "Tarjeta de crédito/débito",
    paypal: "PayPal",
    conductor: "Pago al conductor",
  };

  return (
    <div className="paso-wizard paso6">

      {/* ── Icono de éxito ───────────────────────────────────────── */}
      <div className="paso6__exito">
        <div className="paso6__check-circulo" aria-hidden="true">✓</div>
        <h2 className="paso6__titulo">¡Reserva confirmada!</h2>
        <p className="paso6__subtitulo">
          Te hemos enviado la confirmación a{" "}
          <strong>{reserva.cliente?.email}</strong>
        </p>
        {/* Número de reserva destacado */}
        <div className="paso6__numero-reserva">
          <span className="paso6__numero-etiqueta">Número de reserva</span>
          <span className="paso6__numero-valor">{numeroReserva}</span>
        </div>
      </div>

      {/* ── Resumen de la reserva ────────────────────────────────── */}
      <div className="paso6__resumen">
        <h3 className="paso6__resumen-titulo">Resumen de tu reserva</h3>

        {/* Servicio */}
        <div className="paso6__fila">
          <span className="paso6__etiqueta">Servicio</span>
          <span className="paso6__valor">
            {servicioInfo?.icono} {servicioInfo?.tituloEs}
          </span>
        </div>

        {/* Ruta */}
        {reserva.ruta && (
          <>
            <div className="paso6__fila">
              <span className="paso6__etiqueta">Origen</span>
              <span className="paso6__valor">{reserva.ruta.origen}</span>
            </div>
            <div className="paso6__fila">
              <span className="paso6__etiqueta">Destino</span>
              <span className="paso6__valor">{reserva.ruta.destino}</span>
            </div>
            <div className="paso6__fila">
              <span className="paso6__etiqueta">Fecha y hora</span>
              <span className="paso6__valor">
                {formatearFecha(reserva.ruta.fecha)} a las {reserva.ruta.hora}
              </span>
            </div>
            <div className="paso6__fila">
              <span className="paso6__etiqueta">Pasajeros</span>
              <span className="paso6__valor">
                {reserva.ruta.pasajeros} pasajero
                {reserva.ruta.pasajeros !== 1 ? "s" : ""},{" "}
                {reserva.ruta.maletas} maleta
                {reserva.ruta.maletas !== 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}

        {/* Vehículo y precio */}
        {vehiculoInfo && (
          <div className="paso6__fila">
            <span className="paso6__etiqueta">Vehículo</span>
            <span className="paso6__valor">
              {vehiculoInfo.icono} {vehiculoInfo.nombre}
            </span>
          </div>
        )}

        {/* Método de pago */}
        <div className="paso6__fila">
          <span className="paso6__etiqueta">Pago</span>
          <span className="paso6__valor">
            {etiquetaMetodoPago[reserva.metodoPago ?? ""] ?? reserva.metodoPago}
          </span>
        </div>

        {/* Precio total */}
        {vehiculoInfo && (
          <div className="paso6__fila paso6__fila--total">
            <span className="paso6__etiqueta paso6__etiqueta--total">
              Total
            </span>
            <span className="paso6__valor paso6__valor--total">
              {vehiculoInfo.precio}€
            </span>
          </div>
        )}
      </div>

      {/* ── Próximos pasos ───────────────────────────────────────── */}
      <div className="paso6__proximos-pasos">
        <h3 className="paso6__proximos-titulo">¿Qué pasa ahora?</h3>
        <ol className="paso6__proximos-lista">
          <li>Recibirás un email de confirmación en los próximos minutos.</li>
          <li>El día del transfer, tu conductor te contactará 30 min antes.</li>
          <li>
            Para cambios o cancelaciones, contacta con nosotros al{" "}
            <a href="tel:+34600000000" className="paso6__telefono">
              +34 600 000 000
            </a>
          </li>
        </ol>
      </div>

      {/* ── Botón para hacer otra reserva ───────────────────────── */}
      <div className="paso-wizard__acciones">
        <button
          type="button"
          onClick={onNuevaReserva}
          className="boton-amarillo"
        >
          Hacer otra reserva
        </button>
        <a href="/" className="paso6__volver-home">
          Volver al inicio
        </a>
      </div>

    </div>
  );
}