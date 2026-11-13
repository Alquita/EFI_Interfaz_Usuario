"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Heart, House, MapPinned, Sparkles, User } from "lucide-react";
import { useEstado, useHidratado } from "@/lib/store";

const ITEMS = [
  { href: "/", texto: "Inicio", icono: House },
  { href: "/descubrir", texto: "Descubrir", icono: Sparkles },
  { href: "/refugios", texto: "Refugios", icono: MapPinned },
  { href: "/favoritos", texto: "Favoritos", icono: Heart },
  { href: "/perfil", texto: "Perfil", icono: User },
];

/** Navegación inferior en móvil (se oculta en la ficha y en formularios con barra de CTA) */
export function BarraInferior() {
  const ruta = usePathname();
  const { favoritos } = useEstado();
  const hidratado = useHidratado();
  if (ruta.startsWith("/mascota/") || ruta.startsWith("/adoptar/")) return null;

  return (
    <nav className="barra-inferior" aria-label="Accesos rápidos">
      <ul className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const activo = it.href === "/" ? ruta === "/" : ruta.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} aria-current={activo ? "page" : undefined}>
                <span className="pildora isolate">
                  {activo && (
                    <motion.span
                      layoutId="barra-pildora"
                      className="pildora-activa"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <it.icono className="size-[1.375rem]" aria-hidden="true" />
                  {it.href === "/favoritos" && hidratado && favoritos.length > 0 && (
                    <span className="contador-badge !right-2 !top-[-0.25rem]">{favoritos.length}</span>
                  )}
                </span>
                {it.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
