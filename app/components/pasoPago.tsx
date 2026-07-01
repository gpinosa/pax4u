"use client";

import { MetodoPago } from "./tipoReserva";

/**
 * Paso5Pago — Paso 5 del wizard de reserva
 *
 * Cambios respecto a la versión anterior:
 * - Recibe prop "guardando" para deshabilitar el botón mientras
 *   se guarda la reserva en Firestore
 * - El botón muestra "Guardando..." mientras espera
 */



interface Props {
  seleccion: MetodoPago | null;
  precioTotal: number;
  onSeleccionar: (metodo: MetodoPago) => void;
  onConfirmar: () => void;
  onAtras: () => void;
  guardando?: boolean; // ← nueva prop
}

const METODOS_PAGO: {
  id: MetodoPago;
  icono: string;
  nombre: string;
  descripcion: string;
  etiqueta?: string;
}[] = [
  {
    id: "tarjeta",
    icono: "💳",
    nombre: "Tarjeta de crédito / débito",
    descripcion: "Pago seguro con Visa, Mastercard o Amex. Procesado por Stripe.",
    etiqueta: "Recomendado",
  },
  {
    id: "paypal",
    icono: "🅿️",
    nombre: "PayPal",
    descripcion: "Paga con tu cuenta PayPal. Rápido y seguro.",
  },
  {
    id: "conductor",
    icono: "💶",
    nombre: "Pago al conductor",
    descripcion: "Paga en efectivo o tarjeta directamente al conductor al subir.",
  },
];

export default function Paso5Pago({
  seleccion,
  precioTotal,
  onSeleccionar,
  onConfirmar,
  onAtras,
  guardando = false,
}: Props) {
  return (
    <div className="paso-wizard">

      <div className="paso-wizard__cabecera">
        <h2 className="paso-wizard__titulo">Método de pago</h2>
        <p className="paso-wizard__subtitulo">
          Elige cómo prefieres pagar tu reserva.
        </p>
      </div>

      {/* Precio total */}
      <div className="paso5__resumen-precio">
        <span className="paso5__precio-etiqueta">Total a pagar</span>
        <span className="paso5__precio-valor">{precioTotal}€</span>
        <span className="paso5__precio-nota">Precio fijo incluido IVA</span>
      </div>

      {/* Métodos de pago */}
      <div className="paso5__metodos">
        {METODOS_PAGO.map((metodo) => {
          const estaSeleccionado = seleccion === metodo.id;
          return (
            <button
              key={metodo.id}
              type="button"
              onClick={() => onSeleccionar(metodo.id)}
              className={`metodo-pago ${estaSeleccionado ? "metodo-pago--activo" : ""}`}
              aria-pressed={estaSeleccionado}
            >
              <span
                className={`metodo-pago__radio ${estaSeleccionado ? "metodo-pago__radio--activo" : ""}`}
                aria-hidden="true"
              />
              <span className="metodo-pago__icono" aria-hidden="true">
                {metodo.icono}
              </span>
              <div className="metodo-pago__texto">
                <span className="metodo-pago__nombre">
                  {metodo.nombre}
                  {metodo.etiqueta && (
                    <span className="metodo-pago__etiqueta">{metodo.etiqueta}</span>
                  )}
                </span>
                <span className="metodo-pago__descripcion">
                  {metodo.descripcion}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {seleccion === "tarjeta" && (
        <div className="paso5__formulario-pago">
          <div className="paso5__stripe-placeholder">
            <p>🔒 Formulario de tarjeta seguro (Stripe — próximamente)</p>
          </div>
        </div>
      )}

      {seleccion === "paypal" && (
        <div className="paso5__formulario-pago">
          <div className="paso5__stripe-placeholder">
            <p>🅿️ Botones de PayPal (próximamente)</p>
          </div>
        </div>
      )}

      <p className="paso5__seguridad">
        🔐 Tus datos de pago nunca se almacenan en nuestros servidores.
      </p>

      <div className="paso-wizard__acciones paso-wizard__acciones--doble">
        <button
          type="button"
          onClick={onAtras}
          disabled={guardando}
          className="boton-atras"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={!seleccion || guardando}
          className="boton-confirmar"
        >
          {guardando ? "Guardando reserva..." : "Confirmar reserva →"}
        </button>
      </div>

    </div>
  );
}