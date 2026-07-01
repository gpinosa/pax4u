/**
 * layout.tsx — Layout raíz de Pax4u
 *
 * Solo importamos globals.css — contiene todo el CSS de la app
 * sin ninguna directiva de Tailwind, para evitar que el procesador
 * de Tailwind v4 purgue nuestros estilos custom.
 *
 * Si en el futuro necesitas Tailwind para algún componente,
 * añade @import "tailwindcss" AL FINAL de globals.css.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pax4u — Private Transfers & Tours Barcelona",
  description:
    "Private airport transfer, Barcelona tours, cruise port transfer. Fixed price, professional drivers. Book online in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}