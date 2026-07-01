/**
 * tipos-reserva.ts — Tipos TypeScript compartidos del wizard de reserva
 *
 * Centraliza todas las interfaces y enums del flujo de reserva
 * para que todos los componentes del wizard usen la misma estructura.
 *
 * Si en el futuro se conecta con una API backend, estos tipos
 * deben coincidir con los DTOs del servidor (o generarse desde OpenAPI).
 */

// ─── Paso 1: Tipo de servicio ─────────────────────────────────────────────────

export type SlugServicio =
  | "aeropuerto-privado"
  | "aeropuerto-barcelona"
  | "taxi-privado"
  | "tours"
  | "crucero"
  | "hotel"
  | "conductor-privado";

export interface OpcionServicio {
  slug: SlugServicio;
  icono: string;
  titulo: string;       // En inglés (SEO)
  tituloEs: string;     // En español (UI)
}

// ─── Paso 2: Detalles de ruta ─────────────────────────────────────────────────

export interface DetallesRuta {
  origen: string;
  destino: string;
  fecha: string;        // formato ISO: "YYYY-MM-DD"
  hora: string;         // formato "HH:MM"
  pasajeros: number;
  maletas: number;
}

// ─── Paso 3: Vehículo ─────────────────────────────────────────────────────────

export type TipoVehiculo = "sedan" | "minivan" | "van";

export interface Vehiculo {
  tipo: TipoVehiculo;
  nombre: string;
  descripcion: string;
  capacidadPasajeros: number;
  capacidadMaletas: number;
  precio: number;       // En euros, precio base
  icono: string;
}

// ─── Paso 4: Datos del cliente ────────────────────────────────────────────────

export interface DatosCliente {
  nombre: string;
  email: string;
  telefono: string;
  comentarios: string;
}

// ─── Paso 5: Método de pago ───────────────────────────────────────────────────

export type MetodoPago = "tarjeta" | "paypal" | "conductor";

// ─── Estado global del wizard ─────────────────────────────────────────────────
// Agrupa todos los datos recogidos en los 6 pasos

export interface EstadoReserva {
  // Paso 1
  servicio: SlugServicio | null;

  // Paso 2
  ruta: DetallesRuta | null;

  // Paso 3
  vehiculo: TipoVehiculo | any;

  // Paso 4
  cliente: DatosCliente | null;

  // Paso 5
  metodoPago: MetodoPago | null;

  // Paso 6 (generado por el backend en Fase 2)
  numeroReserva?: string;
}

// ─── Precio por vehículo (en Fase 2 vendrá del backend) ──────────────────────
// Precios base fijos para la Fase 1. El backend los calculará dinámicamente
// según la ruta en fases posteriores.

export const PRECIOS_VEHICULO: Record<TipoVehiculo, number> = {
  sedan: 35,
  minivan: 55,
  van: 80,
};

// ─── Catálogo de vehículos ────────────────────────────────────────────────────

export const VEHICULOS: Vehiculo[] = [
  {
    tipo: "sedan",
    nombre: "Sedán Privado",
    descripcion: "Ideal para 1–3 pasajeros con equipaje de mano.",
    capacidadPasajeros: 3,
    capacidadMaletas: 2,
    precio: PRECIOS_VEHICULO.sedan,
    icono: "🚗",
  },
  {
    tipo: "minivan",
    nombre: "Minivan",
    descripcion: "Perfecto para familias o grupos de hasta 6 personas.",
    capacidadPasajeros: 6,
    capacidadMaletas: 5,
    precio: PRECIOS_VEHICULO.minivan,
    icono: "🚐",
  },
  {
    tipo: "van",
    nombre: "Van / Furgoneta",
    descripcion: "Para grupos grandes o mucho equipaje. Hasta 8 pasajeros.",
    capacidadPasajeros: 8,
    capacidadMaletas: 8,
    precio: PRECIOS_VEHICULO.van,
    icono: "🚌",
  },
];

// ─── Catálogo de servicios (mismos datos que Servicios.tsx, centralizados) ───

export const OPCIONES_SERVICIO: OpcionServicio[] = [
  {
    slug: "aeropuerto-privado",
    icono: "✈️",
    titulo: "Private Airport Transfer",
    tituloEs: "Transfer Privado al Aeropuerto",
  },
  {
    slug: "aeropuerto-barcelona",
    icono: "🛬",
    titulo: "Barcelona Airport Transfer",
    tituloEs: "Transfer Aeropuerto Barcelona",
  },
  {
    slug: "taxi-privado",
    icono: "🚖",
    titulo: "Private Taxi Barcelona",
    tituloEs: "Taxi Privado en Barcelona",
  },
  {
    slug: "tours",
    icono: "🗺️",
    titulo: "Barcelona Tours",
    tituloEs: "Tours Privados por Barcelona",
  },
  {
    slug: "crucero",
    icono: "🚢",
    titulo: "Cruise Port Transfer",
    tituloEs: "Transfer Puerto de Cruceros",
  },
  {
    slug: "hotel",
    icono: "🏨",
    titulo: "Hotel Transfer",
    tituloEs: "Transfer al Hotel",
  },
  {
    slug: "conductor-privado",
    icono: "🚗",
    titulo: "Private Driver Service",
    tituloEs: "Servicio de Conductor Privado",
  },
];