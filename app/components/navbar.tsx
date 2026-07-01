"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Navbar - Barra de navegación principal de Pax4u
 *
 * El botón "Reservar Ahora" lleva a /reservar (página del wizard).
 * Los links del menú hacen scroll suave a las secciones de la home.
 *
 * Comportamiento según página:
 * - En la home (/): los links anclan a secciones (#servicios, etc.)
 * - En cualquier página: "Reservar Ahora" siempre va a /reservar
 * - El logo siempre vuelve a la home (/)
 */

// ─── Textos (reemplazar con i18n en el futuro) ───────────────────────────────
const textos = {
  servicios: "Servicios",
  tours: "Tours",
  comoFunciona: "Cómo Funciona",
  contacto: "Contacto",
  reservarAhora: "Reservar Ahora",
};

// ─── Links del menú — anclan a secciones de la home ──────────────────────────
const navLinks = [
  { href: "/#servicios", label: textos.servicios },
  { href: "/tours", label: textos.tours },
  { href: "/#como-funciona", label: textos.comoFunciona },
  { href: "/contacto", label: textos.contacto },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__contenedor">

        {/* ── Logo → home ──────────────────────────────────────────── */}
        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-pax">PA</span>
          <span className="navbar__logo-x">X</span>
          <span className="navbar__logo-pax">4U</span>
        </Link>

        {/* ── Menú desktop ─────────────────────────────────────────── */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="navbar__link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Botón CTA → /reservar ─────────────────────────────────
         * href="/reservar" en vez de "#reservar"
         * Así funciona desde cualquier página, no solo la home.
         * ─────────────────────────────────────────────────────────── */}
        <Link href="/reservar" className="navbar__cta">
          {textos.reservarAhora}
        </Link>

        {/* ── Hamburguesa (móvil) ───────────────────────────────────── */}
        <button
          className="navbar__hamburguesa"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <span className={`navbar__linea ${menuAbierto ? "navbar__linea--activa-1" : ""}`} />
          <span className={`navbar__linea ${menuAbierto ? "navbar__linea--activa-2" : ""}`} />
          <span className={`navbar__linea ${menuAbierto ? "navbar__linea--activa-3" : ""}`} />
        </button>
      </div>

      {/* ── Menú móvil desplegable ────────────────────────────────────── */}
      {menuAbierto && (
        <div className="navbar__menu-movil">
          <ul className="navbar__links-movil">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="navbar__link-movil"
                  onClick={() => setMenuAbierto(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* CTA también en el menú móvil → /reservar */}
            <li>
              <Link
                href="/reservar"
                className="navbar__cta navbar__cta--movil"
                onClick={() => setMenuAbierto(false)}
              >
                {textos.reservarAhora}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}