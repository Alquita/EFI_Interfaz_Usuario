"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { Toaster } from "sonner";
import { useEstado } from "@/lib/store";

/** true si el sistema o los Ajustes de AdoptApp piden reducir el movimiento */
export function useMovimientoReducido() {
  const sistema = useReducedMotion();
  const { ajustes } = useEstado();
  return Boolean(sistema) || ajustes.reducirMovimiento;
}

export function Proveedores({ children }: { children: ReactNode }) {
  const { ajustes, tema } = useEstado();

  /* Sincroniza los ajustes con atributos del <html> (los lee el CSS) */
  useEffect(() => {
    const raiz = document.documentElement;
    if (ajustes.textoGrande) raiz.setAttribute("data-text", "grande");
    else raiz.removeAttribute("data-text");
    if (ajustes.reducirMovimiento) raiz.setAttribute("data-motion", "reducido");
    else raiz.removeAttribute("data-motion");
  }, [ajustes.textoGrande, ajustes.reducirMovimiento]);

  /* Tema: claro / oscuro / el del sistema (escucha cambios del sistema) */
  useEffect(() => {
    const raiz = document.documentElement;
    const consulta = window.matchMedia("(prefers-color-scheme: dark)");
    const aplicar = () => {
      const oscuro = tema === "oscuro" || (tema === "sistema" && consulta.matches);
      raiz.setAttribute("data-theme", oscuro ? "dark" : "light");
    };
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, [tema]);

  return (
    <MotionConfig reducedMotion={ajustes.reducirMovimiento ? "always" : "user"}>
      {children}
      <Toaster
        position="bottom-center"
        offset={{ bottom: 24 }}
        mobileOffset={{ bottom: 96 }}
        toastOptions={{ className: "aviso", duration: 3800 }}
      />
    </MotionConfig>
  );
}
