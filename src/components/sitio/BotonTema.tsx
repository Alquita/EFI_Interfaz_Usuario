"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore, type MouseEvent } from "react";
import { acciones } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMovimientoReducido } from "./Proveedores";

function suscribirTema(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

export function useTemaOscuro() {
  return useSyncExternalStore(
    suscribirTema,
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false,
  );
}

/** Cambia el tema con un círculo que se expande desde el botón (View Transitions) */
export function cambiarTemaAnimado(oscuro: boolean, origen?: { x: number; y: number }, sinAnimar = false) {
  const raiz = document.documentElement;
  const aplicar = () => {
    raiz.setAttribute("data-theme", oscuro ? "dark" : "light");
    acciones.cambiarTema(oscuro ? "oscuro" : "claro");
  };
  if (sinAnimar || !("startViewTransition" in document)) {
    aplicar();
    return;
  }
  const x = origen?.x ?? window.innerWidth - 40;
  const y = origen?.y ?? 32;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  raiz.style.setProperty("--tema-x", `${x}px`);
  raiz.style.setProperty("--tema-y", `${y}px`);
  raiz.style.setProperty("--tema-r", `${r}px`);
  raiz.classList.add("transicion-tema");
  const t = document.startViewTransition(aplicar);
  t.finished.finally(() => raiz.classList.remove("transicion-tema"));
}

export function BotonTema({ className, conTexto = false }: { className?: string; conTexto?: boolean }) {
  const oscuro = useTemaOscuro();
  const reducido = useMovimientoReducido();

  const alternar = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    cambiarTemaAnimado(!oscuro, { x: r.left + r.width / 2, y: r.top + r.height / 2 }, reducido);
  };

  const etiqueta = oscuro ? "Activar modo claro" : "Activar modo oscuro";

  if (conTexto) {
    return (
      <button type="button" className={cn("btn btn-neutro btn-bloque", className)} onClick={alternar} aria-pressed={oscuro}>
        {oscuro ? <Sun className="size-5" /> : <Moon className="size-5" />}
        {oscuro ? "Modo claro" : "Modo oscuro"}
      </button>
    );
  }

  return (
    <button type="button" className={cn("icon-btn overflow-hidden", className)} onClick={alternar} aria-label={etiqueta} title={etiqueta}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={oscuro ? "sol" : "luna"}
          className="grid place-items-center"
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {oscuro ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
