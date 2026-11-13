"use client";

import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Atributos de accesibilidad para un control con ayuda y error */
export function ariaCampo(id: string, error?: string, conAyuda = false) {
  const desc = [conAyuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": desc || undefined,
  };
}

export function MensajeError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={`${id}-error`}
          className="error-campo"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Campo({
  id,
  etiqueta,
  opcional = false,
  ayuda,
  error,
  children,
  className,
  extra,
}: {
  id: string;
  etiqueta: ReactNode;
  opcional?: boolean;
  ayuda?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  extra?: ReactNode;
}) {
  return (
    <div className={cn("campo", className)}>
      <div className="flex items-baseline gap-2">
        <label htmlFor={id} className="etiqueta">
          {etiqueta}
          {opcional && <span className="opcional"> (opcional)</span>}
        </label>
        {extra}
      </div>
      {ayuda && (
        <p id={`${id}-ayuda`} className="ayuda -mt-1">
          {ayuda}
        </p>
      )}
      {children}
      <MensajeError id={id} error={error} />
    </div>
  );
}
