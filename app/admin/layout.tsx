"use client";

/**
 * app/admin/layout.tsx — Layout protegido del panel de administración
 *
 * Lógica:
 * - /admin/login → renderiza SOLO el formulario, sin ningún hook de sesión
 * - resto de /admin/* → verifica sesión y muestra sidebar
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Link from "next/link";

const ADMINS_PERMITIDOS = ["pinosagerard@gmail.com"];

const MENU_ADMIN = [
  { href: "/admin", icono: "📊", label: "Dashboard" },
  { href: "/admin/reservas", icono: "📋", label: "Reservas" },
  { href: "/admin/precios", icono: "💶", label: "Precios" },
  { href: "/admin/servicios", icono: "🚗", label: "Servicios" },
  { href: "/admin/partners", icono: "🤝", label: "Partners" },
  { href: "/admin/vehiculos", icono: "🚗", label: "Vehículos" },
  { href: "/admin/tours", icono: "🗺️", label: "Tours" },
];

// ─── Componente interno que SÍ usa hooks — solo para rutas protegidas ─────────
function AdminProtegido({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      if (!ADMINS_PERMITIDOS.includes(user.email ?? "")) {
        signOut(auth);
        router.push("/admin/login?error=no-autorizado");
        return;
      }
      setUsuario(user);
      setCargando(false);
    });
    return () => cancelar();
  }, [router]);

  if (cargando) {
    return (
      <div className="admin-cargando">
        <div className="admin-cargando__spinner" />
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-pax">PA</span>
          <span className="admin-sidebar__logo-x">X</span>
          <span className="admin-sidebar__logo-pax">4U</span>
          <span className="admin-sidebar__logo-tag">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {MENU_ADMIN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${
                pathname === item.href ? "admin-sidebar__link--activo" : ""
              }`}
            >
              <span className="admin-sidebar__link-icono">{item.icono}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__usuario">
            <div className="admin-sidebar__avatar">
              {usuario?.displayName?.[0] ?? usuario?.email?.[0] ?? "A"}
            </div>
            <div className="admin-sidebar__usuario-info">
              <span className="admin-sidebar__usuario-nombre">
                {usuario?.displayName ?? "Admin"}
              </span>
              <span className="admin-sidebar__usuario-email">
                {usuario?.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
            className="admin-sidebar__cerrar-sesion"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <button
            className="admin-topbar__hamburguesa"
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          >
            ☰
          </button>
          <span className="admin-topbar__titulo">Panel Admin</span>
        </div>

        {menuMovilAbierto && (
          <div className="admin-menu-movil">
            {MENU_ADMIN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="admin-menu-movil__link"
                onClick={() => setMenuMovilAbierto(false)}
              >
                {item.icono} {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
              className="admin-menu-movil__cerrar"
            >
              Cerrar sesión
            </button>
          </div>
        )}

        <div className="admin-contenido">{children}</div>
      </main>
    </div>
  );
}

// ─── Layout raíz — decide si mostrar login o panel ───────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // La página de login se renderiza directamente, sin protección ni sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // El resto de páginas del admin pasan por la protección de sesión
  return <AdminProtegido>{children}</AdminProtegido>;
}