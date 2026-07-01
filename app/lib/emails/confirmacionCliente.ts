/**
 * lib/emails/confirmacion-cliente.ts
 *
 * Template HTML del email de confirmación que recibe el cliente
 * tras completar una reserva en Pax4u.
 *
 * Diseño:
 * - Fondo negro con tarjeta blanca centrada (igual que el branding de Pax4u)
 * - Logo PAX4U en amarillo
 * - Número de reserva destacado
 * - Resumen completo del trayecto
 * - Información de contacto de emergencia
 *
 * Para personalizar los textos: editar directamente el HTML de abajo.
 * Para añadir más secciones: seguir el patrón de las filas de la tabla.
 */

interface DatosEmailCliente {
  numeroReserva: string;
  nombreCliente: string;
  servicio: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  pasajeros: number;
  maletas: number;
  vehiculo: string;
  precio: number;
  metodoPago: string;
}

// Traduce el slug del servicio a texto legible
function nombreServicio(slug: string): string {
  const nombres: Record<string, string> = {
    "aeropuerto-privado": "Transfer Privado al Aeropuerto",
    "aeropuerto-barcelona": "Transfer Aeropuerto Barcelona",
    "taxi-privado": "Taxi Privado Barcelona",
    "tours": "Tour Privado Barcelona",
    "crucero": "Transfer Puerto de Cruceros",
    "hotel": "Transfer al Hotel",
    "conductor-privado": "Conductor Privado",
  };
  return nombres[slug] ?? slug;
}

// Traduce el tipo de vehículo
function nombreVehiculo(tipo: string): string {
  const nombres: Record<string, string> = {
    sedan: "Sedán Privado",
    minivan: "Minivan",
    van: "Van / Furgoneta",
  };
  return nombres[tipo] ?? tipo;
}

// Traduce el método de pago
function nombrePago(metodo: string): string {
  const nombres: Record<string, string> = {
    tarjeta: "Tarjeta de crédito/débito",
    paypal: "PayPal",
    conductor: "Pago al conductor",
  };
  return nombres[metodo] ?? metodo;
}

// Formatea fecha de YYYY-MM-DD a DD/MM/YYYY
function formatearFecha(fecha: string): string {
  const [anyo, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anyo}`;
}

export function emailConfirmacionCliente(datos: DatosEmailCliente): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de reserva — Pax4u</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Contenedor principal -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Cabecera negra con logo -->
          <tr>
            <td style="background-color:#111111;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;letter-spacing:-0.02em;">
                <span style="color:#ffffff;">PA</span><span style="color:#F7C600;">X</span><span style="color:#ffffff;">4U</span>
              </div>
              <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0;">Transfers Privados · Barcelona</p>
            </td>
          </tr>

          <!-- Cuerpo blanco -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">

              <!-- Título -->
              <h1 style="font-size:22px;font-weight:800;color:#111111;margin:0 0 8px;">
                ¡Reserva confirmada! ✓
              </h1>
              <p style="font-size:15px;color:#666666;margin:0 0 32px;">
                Hola ${datos.nombreCliente}, hemos recibido tu reserva correctamente.
                Tu conductor estará puntual.
              </p>

              <!-- Número de reserva destacado -->
              <div style="background-color:#f5f5f5;border:1.5px solid #e0e0e0;border-radius:10px;padding:20px;text-align:center;margin-bottom:32px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888888;margin:0 0 6px;">
                  Número de reserva
                </p>
                <p style="font-size:22px;font-weight:900;color:#111111;letter-spacing:0.04em;margin:0;">
                  ${datos.numeroReserva}
                </p>
              </div>

              <!-- Resumen del trayecto -->
              <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888888;margin:0 0 16px;border-bottom:1px solid #f0f0f0;padding-bottom:12px;">
                Detalles del trayecto
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ["Servicio", nombreServicio(datos.servicio)],
                  ["Origen", datos.origen],
                  ["Destino", datos.destino],
                  ["Fecha", formatearFecha(datos.fecha)],
                  ["Hora de recogida", datos.hora],
                  ["Pasajeros", `${datos.pasajeros} pasajero${datos.pasajeros !== 1 ? "s" : ""}`],
                  ["Maletas", `${datos.maletas} maleta${datos.maletas !== 1 ? "s" : ""}`],
                  ["Vehículo", nombreVehiculo(datos.vehiculo)],
                  ["Método de pago", nombrePago(datos.metodoPago)],
                ].map(([label, valor]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#888888;width:45%;">${label}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;font-weight:600;color:#111111;text-align:right;">${valor}</td>
                </tr>`).join("")}

                <!-- Fila total en amarillo -->
                <tr>
                  <td style="padding:16px 0 0;font-size:15px;font-weight:800;color:#111111;">Total</td>
                  <td style="padding:16px 0 0;font-size:22px;font-weight:900;color:#111111;text-align:right;">${datos.precio}€</td>
                </tr>
              </table>

              <!-- Qué pasa ahora -->
              <div style="background-color:#fffbeb;border:1.5px solid rgba(247,198,0,0.4);border-radius:10px;padding:20px;margin-bottom:32px;">
                <h3 style="font-size:13px;font-weight:800;color:#111111;margin:0 0 12px;">¿Qué pasa ahora?</h3>
                <ol style="margin:0;padding-left:20px;color:#666666;font-size:13px;line-height:1.8;">
                  <li>Recibirás una llamada de confirmación del conductor el día anterior.</li>
                  <li>El conductor te contactará 30 minutos antes de la recogida.</li>
                  <li>Para cambios o cancelaciones, contacta con nosotros lo antes posible.</li>
                </ol>
              </div>

              <!-- Contacto de emergencia -->
              <div style="text-align:center;padding:20px;background-color:#f9f9f9;border-radius:10px;">
                <p style="font-size:13px;color:#666666;margin:0 0 8px;">¿Necesitas ayuda? Estamos disponibles 24/7</p>
                <a href="https://wa.me/34600000000" style="display:inline-block;background-color:#25D366;color:#ffffff;font-size:14px;font-weight:700;padding:10px 24px;border-radius:8px;text-decoration:none;margin-bottom:8px;">
                  💬 WhatsApp: +34 600 000 000
                </a>
                <p style="font-size:12px;color:#aaaaaa;margin:8px 0 0;">
                  También en <a href="mailto:info@pax4u.com" style="color:#111111;">info@pax4u.com</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Pie de página -->
          <tr>
            <td style="background-color:#f0f0f0;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="font-size:12px;color:#aaaaaa;margin:0;">
                © ${new Date().getFullYear()} Pax4u · Transfers Privados Barcelona<br>
                <a href="https://pax4u.com/privacidad" style="color:#aaaaaa;">Política de privacidad</a> ·
                <a href="https://pax4u.com/condiciones" style="color:#aaaaaa;">Condiciones de reserva</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}