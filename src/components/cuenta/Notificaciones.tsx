"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BellOff, CheckCheck, Trash2 } from "lucide-react";
import { acciones, obtenerEstado, useEstado } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IconoNotificacion } from "@/components/sitio/IconoNotificacion";

export function Notificaciones() {
  const { notificaciones } = useEstado();
  const [soloSinLeer, setSoloSinLeer] = useState(false);
  const sinLeer = notificaciones.filter((n) => !n.leida).length;
  const lista = notificaciones.filter((n) => !soloSinLeer || !n.leida);

  const borrar = (id: string, titulo: string) => {
    const antes = obtenerEstado().notificaciones;
    acciones.borrarNotificacion(id);
    toast("Notificación eliminada", {
      description: titulo,
      action: { label: "Deshacer", onClick: () => acciones.restaurarNotificaciones(antes) },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="pestanas" role="group" aria-label="Filtro">
          {[
            { v: false, t: "Todas", n: notificaciones.length },
            { v: true, t: "Sin leer", n: sinLeer },
          ].map((o) => (
            <button key={o.t} type="button" className="pestana" aria-pressed={soloSinLeer === o.v} onClick={() => setSoloSinLeer(o.v)}>
              {soloSinLeer === o.v && <motion.span layoutId="notif-tab" className="pestana-fondo" />}
              <span className={cn(soloSinLeer === o.v && "text-brand")}>{o.t}</span>
              <span className="cuenta">{o.n}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-fantasma btn-sm" onClick={() => acciones.marcarTodasLeidas()} disabled={!sinLeer}>
          <CheckCheck className="size-4" aria-hidden="true" /> Marcar todas como leídas
        </button>
      </div>

      <ul className="grid gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {lista.map((n) => (
            <motion.li
              key={n.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
              className="group relative"
            >
              <Link href={n.link} className={cn("notif pr-16", !n.leida && "no-leida")} onClick={() => acciones.marcarLeida(n.id)}>
                <IconoNotificacion n={n} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    {!n.leida && <span className="size-2 shrink-0 rounded-full bg-brand-deco" aria-label="Sin leer" />}
                    {n.titulo}
                  </span>
                  <span className="mt-0.5 block text-ink-2">{n.texto}</span>
                  <span className="mt-1 block text-sm text-ink-2">{n.cuando}</span>
                </span>
              </Link>
              <button
                type="button"
                className="icon-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
                aria-label={`Eliminar: ${n.titulo}`}
                onClick={() => borrar(n.id, n.titulo)}
              >
                <Trash2 className="size-5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {!lista.length && (
        <div className="vacio">
          <span className="vacio-icono">
            <BellOff className="size-10" aria-hidden="true" />
          </span>
          <h2 className="t-h3">{soloSinLeer ? "Estás al día" : "No tenés notificaciones"}</h2>
          <p className="text-ink-2">Te avisamos cuando un refugio responda o lleguen mascotas que coincidan con tus filtros.</p>
        </div>
      )}
    </div>
  );
}
