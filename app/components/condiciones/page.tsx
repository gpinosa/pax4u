/**
 * app/condiciones/page.tsx — Condiciones de Reserva
 *
 * Condiciones generales de contratación del servicio de transfers
 * y tours privados de Pax4u en Barcelona.
 *
 * Adaptadas a la legislación española (Real Decreto Legislativo 1/2007,
 * Ley General para la Defensa de los Consumidores y Usuarios).
 */

import Navbar from "../navbar";


export const metadata = {
  title: "Condiciones de Reserva — Pax4u Barcelona",
  description: "Condiciones generales de reserva de transfers y tours privados en Barcelona con Pax4u.",
};

export default function PaginaCondiciones() {
  return (
    <>
      <Navbar />
      <main className="pagina-legal">
        <div className="legal-contenedor">

          <div className="legal-cabecera">
            <p className="legal-eyebrow">Información legal</p>
            <h1 className="legal-titulo">Condiciones de Reserva</h1>
            <p className="legal-fecha">Última actualización: julio de 2025</p>
          </div>

          <div className="legal-cuerpo">

            <section className="legal-seccion">
              <h2>1. Información general</h2>
              <p>Estas condiciones regulan la contratación de servicios de transfer privado y tours en Barcelona ofrecidos por <strong>Pax4u</strong> (en adelante, "la empresa"), con domicilio en Barcelona, España.</p>
              <p>Al realizar una reserva, el cliente acepta íntegramente estas condiciones generales.</p>
            </section>

            <section className="legal-seccion">
              <h2>2. Proceso de reserva</h2>
              <ul>
                <li>Las reservas se realizan a través del formulario online en nuestra web, disponible 24 horas.</li>
                <li>La reserva queda confirmada cuando el cliente recibe el email de confirmación con el número de reserva.</li>
                <li>El precio mostrado en el proceso de reserva es el precio final e incluye IVA. No hay cargos adicionales ocultos.</li>
                <li>Pax4u se reserva el derecho de rechazar una reserva en casos excepcionales, procediendo al reembolso íntegro del importe abonado.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>3. Precios y método de pago</h2>
              <ul>
                <li>Los precios son fijos y se calculan por trayecto, no por tiempo o distancia.</li>
                <li>Los métodos de pago aceptados son: tarjeta de crédito/débito (Visa, Mastercard, Amex), PayPal y pago en efectivo al conductor.</li>
                <li>Los pagos online se procesan de forma segura a través de Stripe y PayPal. Pax4u no almacena datos de tarjetas de crédito.</li>
                <li>En caso de seleccionar "pago al conductor", el importe deberá abonarse en efectivo o tarjeta al inicio del trayecto.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>4. Cancelaciones y modificaciones</h2>

              <h3>Cancelación por parte del cliente</h3>
              <ul>
                <li><strong>Más de 24 horas antes:</strong> reembolso del 100% del importe pagado.</li>
                <li><strong>Entre 12 y 24 horas antes:</strong> reembolso del 50% del importe pagado.</li>
                <li><strong>Menos de 12 horas antes o no presentación:</strong> no se realizará reembolso.</li>
              </ul>

              <h3>Modificaciones</h3>
              <ul>
                <li>Las modificaciones de fecha, hora u origen/destino deben solicitarse con al menos 12 horas de antelación por email o WhatsApp.</li>
                <li>Las modificaciones están sujetas a disponibilidad y pueden implicar un ajuste en el precio.</li>
              </ul>

              <h3>Cancelación por parte de Pax4u</h3>
              <ul>
                <li>En casos de fuerza mayor (condiciones meteorológicas extremas, huelgas, etc.), Pax4u podrá cancelar el servicio con reembolso íntegro al cliente.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>5. Obligaciones del cliente</h2>
              <ul>
                <li>Proporcionar información correcta y completa en el momento de la reserva (origen, destino, número de pasajeros, equipaje).</li>
                <li>Estar en el punto de recogida a la hora acordada. Se esperará un máximo de <strong>15 minutos</strong> en recogidas en hotel o dirección, y <strong>60 minutos</strong> tras el aterrizaje en transfers de aeropuerto.</li>
                <li>Informar de cualquier necesidad especial (silla de bebé, silla de ruedas, equipaje voluminoso) en el momento de la reserva.</li>
                <li>No transportar mercancías ilícitas ni animales sin comunicarlo previamente.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>6. Transfers de aeropuerto</h2>
              <ul>
                <li>Para transfers de llegada al aeropuerto, el conductor monitorizará el vuelo en tiempo real. Si el vuelo se retrasa, no hay coste adicional.</li>
                <li>El punto de encuentro en el aeropuerto El Prat será en la zona de llegadas de la terminal correspondiente, con un cartel con el nombre del cliente.</li>
                <li>El cliente debe informar del número de vuelo en el momento de la reserva.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>7. Responsabilidad</h2>
              <ul>
                <li>Pax4u contrata conductores profesionales con los permisos y seguros requeridos por la legislación española.</li>
                <li>Pax4u no se responsabiliza de retrasos causados por circunstancias ajenas a su control (tráfico, obras, condiciones meteorológicas, etc.).</li>
                <li>El cliente es responsable del equipaje y objetos personales durante el trayecto.</li>
                <li>Pax4u no se responsabiliza de pérdidas de vuelos, trenes u otros transportes derivadas de retrasos no imputables a la empresa.</li>
              </ul>
            </section>

            <section className="legal-seccion">
              <h2>8. Reclamaciones</h2>
              <p>Para cualquier reclamación relacionada con el servicio, el cliente puede contactar con Pax4u en el plazo de <strong>30 días</strong> desde la fecha del servicio a través de:</p>
              <ul>
                <li>Email: <a href="mailto:info@pax4u.com">info@pax4u.com</a></li>
                <li>WhatsApp: +34 600 000 000</li>
              </ul>
              <p>Nos comprometemos a responder en un plazo máximo de 48 horas laborables.</p>
            </section>

            <section className="legal-seccion">
              <h2>9. Legislación aplicable</h2>
              <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Barcelona, con renuncia expresa a cualquier otro fuero.</p>
              <p>En caso de conflicto con consumidores, se podrá acudir a la plataforma de resolución de litigios en línea de la UE: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</p>
            </section>

          </div>

          {/* Links a otras páginas legales */}
          <div className="legal-enlaces">
            <a href="/privacidad">Política de Privacidad</a>
            <a href="/cookies">Política de Cookies</a>
          </div>

        </div>
      </main>
    </>
  );
}