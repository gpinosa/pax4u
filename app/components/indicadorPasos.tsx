/**
 * IndicadorPasos — Barra de progreso del wizard de reserva
 *
 * Muestra visualmente en qué paso está el usuario y cuántos quedan.
 * Ayuda a reducir la ansiedad del usuario en procesos multi-paso.
 *
 * Diseño:
 * - Pasos numerados con círculos: completado (amarillo relleno), actual
 *   (amarillo con borde), pendiente (gris)
 * - Línea conectora entre pasos
 * - Etiqueta de texto debajo del número en desktop
 *
 * Props:
 * - pasoActual: número del paso actual (1–6)
 */

interface Props {
  pasoActual: number;
}

// ─── Definición de los 6 pasos del wizard ────────────────────────────────────
const PASOS = [
  { numero: 1, etiqueta: "Servicio" },
  { numero: 2, etiqueta: "Ruta" },
  { numero: 3, etiqueta: "Vehículo" },
  { numero: 4, etiqueta: "Datos" },
  { numero: 5, etiqueta: "Pago" },
  { numero: 6, etiqueta: "Confirmación" },
];

export default function IndicadorPasos({ pasoActual }: Props) {
  return (
    <nav className="indicador-pasos" aria-label="Progreso de reserva">
      {PASOS.map((paso, index) => {
        const completado = paso.numero < pasoActual;
        const actual = paso.numero === pasoActual;
        const pendiente = paso.numero > pasoActual;

        return (
          <div key={paso.numero} className="indicador-pasos__item">
            {/* Círculo del paso */}
            <div
              className={`
                indicador-pasos__circulo
                ${completado ? "indicador-pasos__circulo--completado" : ""}
                ${actual ? "indicador-pasos__circulo--actual" : ""}
                ${pendiente ? "indicador-pasos__circulo--pendiente" : ""}
              `}
              aria-current={actual ? "step" : undefined}
            >
              {/* Mostrar check en completados, número en el resto */}
              {completado ? "✓" : paso.numero}
            </div>

            {/* Etiqueta del paso (visible en desktop) */}
            <span
              className={`
                indicador-pasos__etiqueta
                ${actual ? "indicador-pasos__etiqueta--actual" : ""}
              `}
            >
              {paso.etiqueta}
            </span>

            {/* Línea conectora (no se muestra después del último paso) */}
            {index < PASOS.length - 1 && (
              <div
                className={`
                  indicador-pasos__linea
                  ${completado ? "indicador-pasos__linea--completada" : ""}
                `}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}