/**
 * app/api/reservas/confirmar/route.ts — API Route de confirmación de reserva
 *
 * Se llama desde WizardReserva.tsx justo después de guardar en Firestore.
 * Envía dos emails via Resend:
 *   1. Confirmación al cliente
 *   2. Notificación interna al admin
 *
 * Método: POST
 * Body: los datos completos de la reserva (JSON)
 *
 * Para probar sin dominio propio, Resend permite enviar desde:
 *   onboarding@resend.dev  (solo hacia tu propio email)
 *
 * Cuando tengas dominio (pax4u.com):
 *   1. Ir a Resend → Domains → Add Domain → verificar DNS
 *   2. Cambiar FROM_EMAIL a "info@pax4u.com"
 *   3. Cambiar ADMIN_EMAIL a tu email real de operaciones
 */

import { emailConfirmacionCliente } from "@/app/lib/emails/confirmacionCliente";
import { emailNotificacionInterna } from "@/app/lib/emails/notificacionInterna";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";


// ─── Configuración ────────────────────────────────────────────────────────────

// Email desde el que se envían los correos
// Sin dominio propio: usar "onboarding@resend.dev" (solo funciona hacia tu email)
// Con dominio: "info@pax4u.com"
const FROM_EMAIL = "Pax4u <onboarding@resend.dev>";

// Email del administrador que recibe las notificaciones internas
// EDITAR: cambiar por el email real de operaciones
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? "cuentadewallagerard@gmail.com";

// ─── Handler POST ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Inicializar Resend con la API key del .env.local
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Leer los datos de la reserva del body
    const datos = await request.json();

    const {
      numeroReserva,
      cliente,
      servicio,
      ruta,
      vehiculo,
      precio,
      metodoPago,
    } = datos;

    // Validar que los datos mínimos están presentes
    if (!numeroReserva || !cliente?.email) {
      return NextResponse.json(
        { error: "Datos de reserva incompletos" },
        { status: 400 }
      );
    }

    // ─── Email 1: Confirmación al cliente ───────────────────────────────────
    const { error: errorCliente } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [cliente.email],
      subject: `✓ Reserva confirmada — ${numeroReserva} | Pax4u`,
      html: emailConfirmacionCliente({
        numeroReserva,
        nombreCliente: cliente.nombre,
        servicio,
        origen: ruta?.origen ?? "",
        destino: ruta?.destino ?? "",
        fecha: ruta?.fecha ?? "",
        hora: ruta?.hora ?? "",
        pasajeros: ruta?.pasajeros ?? 1,
        maletas: ruta?.maletas ?? 0,
        vehiculo,
        precio,
        metodoPago,
      }),
    });

    if (errorCliente) {
      console.error("Error al enviar email al cliente:", errorCliente);
    }

    // ─── Email 2: Notificación interna al admin ──────────────────────────────
    const { error: errorAdmin } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🚗 Nueva reserva ${numeroReserva} — ${cliente.nombre}`,
      html: emailNotificacionInterna({
        numeroReserva,
        nombreCliente: cliente.nombre,
        emailCliente: cliente.email,
        telefonoCliente: cliente.telefono ?? "",
        servicio,
        origen: ruta?.origen ?? "",
        destino: ruta?.destino ?? "",
        fecha: ruta?.fecha ?? "",
        hora: ruta?.hora ?? "",
        pasajeros: ruta?.pasajeros ?? 1,
        vehiculo,
        precio,
        metodoPago,
      }),
    });

    if (errorAdmin) {
      console.error("Error al enviar notificación interna:", errorAdmin);
    }

    // Respuesta exitosa aunque algún email haya fallado
    // (la reserva ya está guardada en Firestore, eso es lo importante)
    return NextResponse.json({
      ok: true,
      emailClienteEnviado: !errorCliente,
      emailAdminEnviado: !errorAdmin,
    });

  } catch (error) {
    console.error("Error en API de confirmación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}