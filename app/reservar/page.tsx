/**
 * app/reservar/page.tsx — Página de reserva de Pax4u
 *
 * Ruta: /reservar
 *
 * Lee el query param `?servicio=slug` para preseleccionar
 * el tipo de servicio en el paso 1 del wizard.
 *
 * Ejemplo de uso desde la home:
 *   <a href="/reservar?servicio=aeropuerto-privado">Reservar transfer →</a>
 *
 * IMPORTANTE — Next.js 15+:
 * searchParams es una Promise y debe resolverse con await.
 * Por eso la función es async. Esto es un cambio de Next.js 15
 * respecto a versiones anteriores donde era un objeto síncrono.
 */

import Navbar from "../components/navbar";
import WizardReserva from "../components/reserva";
import { SlugServicio } from "../components/tipoReserva";



// ─── Lista de slugs válidos para validar el query param ──────────────────────
// Evita que se pase cualquier string arbitrario al wizard
const SLUGS_VALIDOS: SlugServicio[] = [
  "aeropuerto-privado",
  "aeropuerto-barcelona",
  "taxi-privado",
  "tours",
  "crucero",
  "hotel",
  "conductor-privado",
];

interface Props {
  // En Next.js 15+ searchParams es una Promise, no un objeto directo
  searchParams: Promise<{ servicio?: string }>;
}

// La función debe ser async para poder hacer await de searchParams
export default async function PaginaReserva({ searchParams }: Props) {
  // Resolver la Promise antes de acceder a sus propiedades
  const params = await searchParams;

  // Validar que el query param es un slug conocido (por seguridad)
  const servicioParam = params.servicio as SlugServicio | undefined;
  const servicioInicial = SLUGS_VALIDOS.includes(servicioParam as SlugServicio)
    ? servicioParam
    : undefined;

  return (
    <>
      <Navbar />

      <main className="pagina-reserva">
        {/* ── Cabecera de la página ─────────────────────────────── */}
        <div className="pagina-reserva__cabecera">
          <h1 className="pagina-reserva__titulo">Reserva tu transfer</h1>
          <p className="pagina-reserva__subtitulo">
            Precio fijo · Sin sorpresas · Confirmación inmediata
          </p>
        </div>

        {/* ── Wizard de 6 pasos ─────────────────────────────────── */}
        <div className="pagina-reserva__contenedor">
          <WizardReserva servicioInicial={servicioInicial} />
        </div>
      </main>
    </>
  );
}