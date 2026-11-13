"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { Ban, ChevronDown, CircleCheck, CircleX, ClipboardList, Clock, MessageCircle, PawPrint, Phone, TriangleAlert } from "lucide-react";
import type { EstadoSolicitud, Solicitud } from "@/types";
import { MASCOTAS } from "@/data/mascotas";
import { REFUGIOS } from "@/data/refugios";
import { acciones, useEstado, useHidratado } from "@/lib/store";
import { cn, fechaCorta } from "@/lib/utils";

const ESTADOS: Record<EstadoSolicitud, { t: string; clase: string; i: typeof Clock }> = {
  revision: { t: "En revisión", clase: "estado-revision", i: Clock },
  aprobada: { t: "Aprobada", clase: "estado-exito", i: CircleCheck },
  rechazada: { t: "No avanzó", clase: "estado-error", i: CircleX },
  cancelada: { t: "Cancelada", clase: "estado-neutro", i: Ban },
};

function pasos(e: EstadoSolicitud) {
  const base = ["Enviada", "En revisión", "Respuesta", "Encuentro"];
  const clases: Record<EstadoSolicitud, string[]> = {
    revision: ["hecho", "actual", "", ""],
    aprobada: ["hecho", "hecho", "hecho", "actual"],
    rechazada: ["hecho", "hecho", "fallido", ""],
    cancelada: ["hecho", "fallido", "", ""],
  };
  const textos = [...base];
  if (e === "aprobada") textos[2] = "Aprobada";
  if (e === "rechazada") textos[2] = "No avanzó";
  if (e === "cancelada") textos[1] = "Cancelada";
  return textos.map((t, i) => ({ t, c: clases[e][i] }));
}

const FILTROS: { v: EstadoSolicitud | "todas"; t: string }[] = [
  { v: "todas", t: "Todas" },
  { v: "revision", t: "En revisión" },
  { v: "aprobada", t: "Aprobadas" },
  { v: "rechazada", t: "No avanzaron" },
  { v: "cancelada", t: "Canceladas" },
];

export function Solicitudes() {
  const { solicitudes, usuario } = useEstado();
  const hidratado = useHidratado();
  const [filtro, setFiltro] = useState<EstadoSolicitud | "todas">("todas");
  const lista = solicitudes.filter((s) => filtro === "todas" || s.estado === filtro);

  if (hidratado && !usuario) {
    return (
      <div className="vacio">
        <span className="vacio-icono">
          <ClipboardList className="size-10" aria-hidden="true" />
        </span>
        <h2 className="t-h3">Ingresá para ver tus solicitudes</h2>
        <Link href="/ingresar?volver=/mis-solicitudes" className="btn btn-primario mt-2">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="pestanas" role="tablist" aria-label="Filtrar por estado">
        {FILTROS.map((f) => {
          const n = f.v === "todas" ? solicitudes.length : solicitudes.filter((s) => s.estado === f.v).length;
          return (
            <button key={f.v} role="tab" type="button" className="pestana" aria-selected={filtro === f.v} onClick={() => setFiltro(f.v)}>
              {filtro === f.v && <motion.span layoutId="sol-tab" className="pestana-fondo" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              {f.t}
              <span className="cuenta">{n}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-8 grid gap-5" role="tabpanel">
        <AnimatePresence mode="popLayout" initial={false}>
          {lista.map((s) => (
            <motion.li key={s.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <TarjetaSolicitud s={s} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {!lista.length && (
        <div className="vacio">
          <span className="vacio-icono">
            <ClipboardList className="size-10" aria-hidden="true" />
          </span>
          <h2 className="t-h3">No hay solicitudes acá</h2>
          <p className="text-ink-2">Cuando envíes una, vas a poder seguir su estado en esta pantalla.</p>
          <Link href="/#mascotas" className="btn btn-primario mt-2">
            Ver mascotas
          </Link>
        </div>
      )}
    </div>
  );
}

function TarjetaSolicitud({ s }: { s: Solicitud }) {
  const m = MASCOTAS.find((x) => x.id === s.mascota)!;
  const r = REFUGIOS[m.refugio];
  const e = ESTADOS[s.estado];
  const [verDatos, setVerDatos] = useState(false);

  return (
    <article id={s.id} className="tarjeta scroll-mt overflow-hidden target:ring-4 target:ring-brand-deco/60">
      <div className="grid gap-6 p-5 md:grid-cols-[9rem_1fr] md:p-7">
        <Link href={`/mascota/${m.id}`} className="relative block aspect-square w-28 overflow-hidden rounded-2xl md:w-full">
          <Image src={m.foto} alt={m.alt} fill sizes="9rem" className="object-cover transition-transform duration-500 hover:scale-105" />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="t-h3">Solicitud por {m.nombre}</h2>
              <p className="text-ink-2">
                {r.nombre} · enviada el {fechaCorta(s.fecha)}
              </p>
            </div>
            <span className={cn("estado", e.clase)}>
              <e.i className="size-4" aria-hidden="true" /> {e.t}
            </span>
          </div>

          <ol className="linea-tiempo mt-6" aria-label="Progreso de la solicitud">
            {pasos(s.estado).map((p) => (
              <li key={p.t} className={p.c}>
                {p.t}
                {p.c === "actual" && <span className="sr-only"> (paso actual)</span>}
              </li>
            ))}
          </ol>

          <p className="mt-6">{s.mensaje}</p>

          {s.mensajeRefugio && (
            <div className="mt-4 flex gap-3">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image src={r.foto} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-surface p-4">
                <p className="text-sm font-semibold">{r.nombre}</p>
                <p className="mt-1 text-[0.9375rem] leading-6 text-ink-2">{s.mensajeRefugio}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {s.estado === "aprobada" && (
              <>
                <a href={`https://wa.me/54${r.telefono.replace(/\s/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-primario btn-sm">
                  <MessageCircle className="size-4" aria-hidden="true" /> Responder por WhatsApp
                </a>
                <Link href={`/mascota/${m.id}`} className="btn btn-secundario btn-sm">
                  Agendar el encuentro
                </Link>
              </>
            )}
            {s.estado === "revision" && (
              <>
                <a href={`tel:${r.telefono.replace(/\s/g, "")}`} className="btn btn-neutro btn-sm">
                  <Phone className="size-4" aria-hidden="true" /> Llamar al refugio
                </a>
                <Cancelar s={s} nombre={m.nombre} />
              </>
            )}
            {s.estado === "rechazada" && (
              <Link href={`/?especie=${m.especie}#mascotas`} className="btn btn-secundario btn-sm">
                <PawPrint className="size-4" aria-hidden="true" /> Ver mascotas parecidas
              </Link>
            )}
            {s.datos && (
              <button type="button" className="btn btn-fantasma btn-sm" aria-expanded={verDatos} onClick={() => setVerDatos((v) => !v)}>
                Datos enviados
                <ChevronDown className={cn("size-4 transition-transform", verDatos && "rotate-180")} aria-hidden="true" />
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {verDatos && s.datos && (
              <motion.dl
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid overflow-hidden sm:grid-cols-2"
              >
                {[
                  ["Nombre", s.datos.nombre],
                  ["Teléfono", s.datos.telefono],
                  ["Correo", s.datos.correo],
                  ["Barrio", s.datos.barrio],
                  ["Vivienda", s.datos.vivienda],
                  ["Otros animales", s.datos.otras],
                ].map(([t, v]) => (
                  <div key={t} className="border-b border-line py-3 pr-4">
                    <dt className="text-sm text-ink-2">{t}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}

function Cancelar({ s, nombre }: { s: Solicitud; nombre: string }) {
  const [abierto, setAbierto] = useState(false);
  useLayoutEffect(() => () => setAbierto(false), []);
  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger className="btn btn-peligro btn-sm">Cancelar solicitud</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg p-6 md:p-8" role="alertdialog">
          <span className="icono-modal !bg-danger-bg !text-danger">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <Dialog.Title className="t-h3 mt-4">¿Cancelar la solicitud por {nombre}?</Dialog.Title>
          <Dialog.Description className="mt-2 text-ink-2">
            El refugio deja de revisarla. Si cambiás de idea, vas a tener que enviar una nueva.
          </Dialog.Description>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close className="btn btn-neutro">Volver</Dialog.Close>
            <button
              type="button"
              className="btn btn-primario !bg-danger hover:!bg-danger"
              onClick={() => {
                acciones.cancelarSolicitud(s.id);
                setAbierto(false);
                toast(`Cancelaste la solicitud por ${nombre}`);
              }}
            >
              Sí, cancelar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
