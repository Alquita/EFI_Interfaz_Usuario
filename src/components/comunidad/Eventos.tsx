"use client";

import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useState } from "react";
import { Bell, BellRing, CalendarPlus, Clock, HeartHandshake, MapPin, Mic, Package, Scissors, Syringe, Users } from "lucide-react";
import type { Evento, TipoEvento } from "@/types";
import { EVENTOS } from "@/data/eventos";
import { acciones, useEstado } from "@/lib/store";
import { cn, fechaLarga, partesFecha } from "@/lib/utils";

const TIPOS: Record<TipoEvento, { t: string; i: typeof Bell; clase: string }> = {
  adopcion: { t: "Adopción", i: HeartHandshake, clase: "bg-accent-soft text-brand" },
  castracion: { t: "Castración", i: Scissors, clase: "bg-info-bg text-info" },
  salud: { t: "Salud", i: Syringe, clase: "bg-success-bg text-success" },
  colecta: { t: "Colecta", i: Package, clase: "bg-review-bg text-review" },
  charla: { t: "Charla", i: Mic, clase: "bg-surface text-ink" },
};

/** Genera un .ics para agregar el evento al calendario del teléfono o de Google */
function descargarIcs(e: Evento) {
  const [a, m, d] = e.fecha.split("-");
  const hora = e.hora.match(/(\d{1,2})/)?.[1] ?? "10";
  const fin = e.hora.match(/a (\d{1,2})/)?.[1] ?? String(Number(hora) + 2);
  const f = (h: string) => `${a}${m}${d}T${h.padStart(2, "0")}0000`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AdoptApp//Eventos//ES",
    "BEGIN:VEVENT",
    `UID:${e.id}@adoptapp`,
    `DTSTART;TZID=America/Argentina/Cordoba:${f(hora)}`,
    `DTEND;TZID=America/Argentina/Cordoba:${f(fin)}`,
    `SUMMARY:${e.titulo}`,
    `LOCATION:${e.lugar}, Río Cuarto`,
    `DESCRIPTION:${e.descripcion} Organiza: ${e.organiza}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `${e.titulo.replace(/[^\wáéíóúñ ]/gi, "").replace(/\s+/g, "-").toLowerCase()}.ics`;
  enlace.click();
  URL.revokeObjectURL(url);
  toast.success("Descargamos el evento para tu calendario");
}

function Calendario({ anio, mes, marcados, onElegir, elegido }: { anio: number; mes: number; marcados: Map<number, Evento[]>; onElegir: (iso: string) => void; elegido: string }) {
  const primero = new Date(Date.UTC(anio, mes, 1)).getUTCDay();
  const dias = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const offset = (primero + 6) % 7; // semana empieza el lunes
  const nombre = partesFecha(`${anio}-${String(mes + 1).padStart(2, "0")}-15`).mesLargo;
  return (
    <div className="tarjeta p-5">
      <p className="mb-3 font-bold capitalize">
        {nombre} {anio}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-2" aria-hidden="true">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const dia = i + 1;
          const ev = marcados.get(dia);
          const iso = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          if (!ev)
            return (
              <span key={dia} className="grid aspect-square place-items-center rounded-lg text-sm text-ink-2">
                {dia}
              </span>
            );
          return (
            <button
              key={dia}
              type="button"
              onClick={() => onElegir(iso)}
              aria-pressed={elegido === iso}
              aria-label={`${dia}: ${ev.map((x) => x.titulo).join(", ")}`}
              className={cn(
                "relative grid aspect-square place-items-center rounded-lg text-sm font-bold transition-colors",
                elegido === iso ? "bg-accent text-white" : "bg-accent-soft text-brand hover:bg-accent hover:text-white",
              )}
            >
              {dia}
              <span className="absolute bottom-1 size-1 rounded-full bg-current" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Eventos() {
  const { recordatorios } = useEstado();
  const [tipo, setTipo] = useState<TipoEvento | "">("");
  const [dia, setDia] = useState("");
  const lista = EVENTOS.filter((e) => (!tipo || e.tipo === tipo) && (!dia || e.fecha === dia));

  const meses = [
    { anio: 2026, mes: 10 },
    { anio: 2026, mes: 11 },
  ].map((x) => {
    const mapa = new Map<number, Evento[]>();
    EVENTOS.filter((e) => {
      const p = e.fecha.split("-").map(Number);
      return p[0] === x.anio && p[1] === x.mes + 1;
    }).forEach((e) => {
      const d = Number(e.fecha.slice(8));
      mapa.set(d, [...(mapa.get(d) ?? []), e]);
    });
    return { ...x, mapa };
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[20rem_1fr]">
      <aside className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        {meses.map((m) => (
          <Calendario key={m.mes} anio={m.anio} mes={m.mes} marcados={m.mapa} elegido={dia} onElegir={(iso) => setDia((d) => (d === iso ? "" : iso))} />
        ))}
        {dia && (
          <button type="button" className="btn btn-fantasma btn-sm" onClick={() => setDia("")}>
            Ver todas las fechas
          </button>
        )}
      </aside>
      <div>
        <div className="fila-chips" role="group" aria-label="Tipo de evento">
          <button type="button" className="chip sin-pildora" aria-pressed={!tipo} onClick={() => setTipo("")}>
            Todos
          </button>
          {(Object.keys(TIPOS) as TipoEvento[]).map((k) => {
            const T = TIPOS[k];
            return (
              <button key={k} type="button" className="chip sin-pildora" aria-pressed={tipo === k} onClick={() => setTipo(tipo === k ? "" : k)}>
                <T.i className="size-4" aria-hidden="true" /> {T.t}
              </button>
            );
          })}
        </div>
        <motion.ul layout className="mt-6 grid gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {lista.map((e) => {
              const f = partesFecha(e.fecha);
              const T = TIPOS[e.tipo];
              const activo = recordatorios.includes(e.id);
              return (
                <motion.li key={e.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <article className="tarjeta eleva grid gap-5 p-6 sm:grid-cols-[auto_1fr]">
                    <span className="fecha-evento">
                      <b>{f.dia}</b>
                      <small>{f.mes}</small>
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", T.clase)}>
                          <T.i className="size-4" aria-hidden="true" /> {T.t}
                        </span>
                        <span className="text-sm text-ink-2 first-letter:uppercase">{fechaLarga(e.fecha)}</span>
                      </div>
                      <h2 className="t-h3 mt-2">{e.titulo}</h2>
                      <p className="mt-2 text-ink-2">{e.descripcion}</p>
                      <ul className="mt-4 grid gap-1.5 text-[0.9375rem] sm:grid-cols-3">
                        <li className="flex items-center gap-2">
                          <Clock className="size-4 text-brand" aria-hidden="true" /> {e.hora}
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="size-4 text-brand" aria-hidden="true" /> {e.lugar}
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="size-4 text-brand" aria-hidden="true" /> {e.organiza}
                        </li>
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={cn("btn btn-sm", activo ? "btn-primario" : "btn-secundario")}
                          aria-pressed={activo}
                          onClick={() => {
                            const ahora = acciones.alternarRecordatorio(e.id);
                            toast(ahora ? "Te avisamos un día antes" : "Quitamos el recordatorio", { description: e.titulo });
                          }}
                        >
                          {activo ? <BellRing className="size-4" aria-hidden="true" /> : <Bell className="size-4" aria-hidden="true" />}
                          {activo ? "Te vamos a avisar" : "Recordarme"}
                        </button>
                        <button type="button" className="btn btn-neutro btn-sm" onClick={() => descargarIcs(e)}>
                          <CalendarPlus className="size-4" aria-hidden="true" /> Agregar al calendario
                        </button>
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
        {!lista.length && <p className="vacio text-ink-2">No hay eventos de ese tipo en estas fechas.</p>}
      </div>
    </div>
  );
}
