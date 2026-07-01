/**
 * lib/emails/notificacion-interna.ts
 *
 * Email de notificación interna que recibe el administrador
 * cada vez que entra una nueva reserva.
 *
 * Es más compacto que el email del cliente — solo los datos
 * esenciales para gestionar la reserva rápidamente.
 */

interface DatosNotificacionInterna {
  numeroReserva: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  servicio: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  pasajeros: number;
  vehiculo: string;
  precio: number;
  metodoPago: string;
}

function formatearFecha(fecha: string): string {
  const [anyo, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anyo}`;
}

export function emailNotificacionInterna(datos: DatosNotificacionInterna): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva reserva — ${datos.numeroReserva}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;">

          <!-- Cabecera -->
          <tr>
            <td style="background:#111111;border-radius:12px 12px 0 0;padding:24px 32px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:22px;font-weight:900;color:#fff;">PA<span style="color:#F7C600;">X</span>4U</span>
                <span style="background:rgba(247,198,0,0.15);color:#F7C600;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;">Nueva reserva</span>
              </div>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="background:#ffffff;padding:32px;">

              <!-- Alerta destacada -->
              <div style="background:#fffbeb;border-left:4px solid #F7C600;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
                <p style="font-size:16px;font-weight:800;color:#111;margin:0 0 4px;">
                  ${datos.numeroReserva}
                </p>
                <p style="font-size:13px;color:#666;margin:0;">
                  ${formatearFecha(datos.fecha)} a las ${datos.hora} · ${datos.origen} → ${datos.destino}
                </p>
              </div>

              <!-- Cliente -->
              <h3 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 12px;">Cliente</h3>
              <table width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;width:40%;">Nombre</td>
                  <td style="font-size:13px;font-weight:700;color:#111;text-align:right;">${datos.nombreCliente}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;">Email</td>
                  <td style="font-size:13px;text-align:right;">
                    <a href="mailto:${datos.emailCliente}" style="color:#111;font-weight:600;">${datos.emailCliente}</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;">Teléfono</td>
                  <td style="font-size:13px;text-align:right;">
                    <a href="tel:${datos.telefonoCliente}" style="color:#111;font-weight:600;">${datos.telefonoCliente}</a>
                  </td>
                </tr>
              </table>

              <!-- Reserva -->
              <h3 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 12px;">Reserva</h3>
              <table width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;width:40%;">Servicio</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${datos.servicio}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;">Pasajeros</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${datos.pasajeros}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;">Vehículo</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${datos.vehiculo}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:6px 0;">Pago</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${datos.metodoPago}</td>
                </tr>
                <tr>
                  <td style="font-size:15px;font-weight:800;color:#111;padding:12px 0 0;">Total</td>
                  <td style="font-size:20px;font-weight:900;color:#111;text-align:right;padding-top:12px;">${datos.precio}€</td>
                </tr>
              </table>

              <!-- Botón al panel -->
              <div style="text-align:center;margin-top:24px;">
                <a href="https://pax4u.vercel.app/admin/reservas" style="display:inline-block;background:#111111;color:#F7C600;font-size:14px;font-weight:800;padding:12px 28px;border-radius:8px;text-decoration:none;">
                  Ver en el panel admin →
                </a>
              </div>

            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="background:#f0f0f0;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
              <p style="font-size:11px;color:#aaa;margin:0;">
                Notificación automática de Pax4u · No respondas a este email
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