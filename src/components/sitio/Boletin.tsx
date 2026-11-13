"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, CircleAlert } from "lucide-react";

export function Boletin() {
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState<"idle" | "error" | "ok">("idle");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
      setEstado("error");
      return;
    }
    setEstado("ok");
    setCorreo("");
  };

  return (
    <form onSubmit={enviar} noValidate className="w-full">
      <label htmlFor="boletin-correo" className="mb-2 block font-medium">
        Tu correo
      </label>
      <div className="flex flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur sm:flex-row">
        <input
          id="boletin-correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value);
            if (estado !== "idle") setEstado("idle");
          }}
          placeholder="nombre@correo.com"
          aria-invalid={estado === "error"}
          aria-describedby="boletin-msj"
          className="min-h-12 flex-1 rounded-xl border-0 bg-transparent px-4 text-white placeholder:text-white/60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#fdba74]"
        />
        <button type="submit" className="btn btn-blanco">
          Suscribirme <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div id="boletin-msj" aria-live="polite" className="mt-2 min-h-6 text-sm">
        <AnimatePresence mode="wait">
          {estado === "error" && (
            <motion.p key="e" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[#fca5a5]">
              <CircleAlert className="size-4" aria-hidden="true" /> Escribí un correo válido, por ejemplo nombre@correo.com
            </motion.p>
          )}
          {estado === "ok" && (
            <motion.p key="o" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[#86efac]">
              <CircleCheck className="size-4" aria-hidden="true" /> ¡Listo! Te sumaste al boletín semanal.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
