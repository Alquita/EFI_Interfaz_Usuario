"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { CircleCheck, CircleHelp, CircleX, Columns3, Heart, Sparkles, X } from "lucide-react";
import type { Convivencia, Mascota } from "@/types";
import { MASCOTAS } from "@/data/mascotas";
import { REFUGIOS } from "@/data/refugios";
import { useEstado, useHidratado } from "@/lib/store";
import { cn, compatibilidad, NOMBRE_TAMANO, pesos } from "@/lib/utils";
import { EsqueletoTarjeta, TarjetaMascota } from "./TarjetaMascota";
import { costoMensual } from "./Ficha";

const MAX = 3;

function Celda({ v }: { v: Convivencia }) {
  if (v === true) return <span className="si inline-flex items-center gap-1"><CircleCheck className="size-4" aria-hidden="true" /> Sí</span>;
  if (v === false) return <span className="no inline-flex items-center gap-1"><CircleX className="size-4" aria-hidden="true" /> No</span>;
  return <span className="quizas inline-flex items-center gap-1"><CircleHelp className="size-4" aria-hidden="true" /> Sin probar</span>;
}

export function Favoritos() {
  const { favoritos, test } = useEstado();
  const hidratado = useHidratado();
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [abierto, setAbierto] = useState(false);
  useLayoutEffect(() => () => setAbierto(false), []);

  const lista = favoritos.map((id) => MASCOTAS.find((m) => m.id === id)).filter(Boolean) as Mascota[];
  const seleccion = elegidos.filter((id) => favoritos.includes(id)).map((id) => MASCOTAS.find((m) => m.id === id)!) ;

  const alternar = (id: string) =>
    setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : e.length >= MAX ? e : [...e, id]));

  if (!hidratado) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          <EsqueletoTarjeta key={i} />
        ))}
      </div>
    );
  }

  if (!lista.length) {
    return (
      <div className="vacio rounded-[2rem] border border-dashed border-line">
        <span className="vacio-icono">
          <Heart className="size-10" aria-hidden="true" />
        </span>
        <h2 className="t-h3">Todavía no guardaste a nadie</h2>
        <p className="max-w-md text-ink-2">Tocá el corazón en cualquier ficha o deslizá a la derecha en Descubrir. Acá vas a poder compararlas.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Link href="/descubrir" className="btn btn-primario">
            <Sparkles className="size-5" aria-hidden="true" /> Ir a Descubrir
          </Link>
          <Link href="/#mascotas" className="btn btn-secundario">
            Ver el catálogo
          </Link>
        </div>
      </div>
    );
  }

  const filas: { t: string; v: (m: Mascota) => React.ReactNode }[] = [
    ...(test ? [{ t: "Tu compatibilidad", v: (m: Mascota) => {
      const p = compatibilidad(m, test).puntos;
      return <span className="anillo !size-14 text-sm" style={{ ["--p" as string]: p }}><span>{p}%</span></span>;
    } }] : []),
    { t: "Edad", v: (m) => m.edad },
    { t: "Tamaño", v: (m) => `${NOMBRE_TAMANO[m.tamano]} · ${m.peso}` },
    { t: "Sexo", v: (m) => (m.sexo === "hembra" ? "Hembra" : "Macho") },
    { t: "Castración", v: (m) => (m.castrado ? <Celda v={true} /> : <span className="quizas">Incluida, pendiente</span>) },
    { t: "Con perros", v: (m) => <Celda v={m.convive.perros} /> },
    { t: "Con gatos", v: (m) => <Celda v={m.convive.gatos} /> },
    { t: "Con chicos", v: (m) => <Celda v={m.convive.chicos} /> },
    { t: "Carácter", v: (m) => m.rasgos.join(", ") },
    { t: "Refugio", v: (m) => `${REFUGIOS[m.refugio].nombre} · ${String(m.distancia).replace(".", ",")} km` },
    { t: "Costo por mes", v: (m) => <strong>{pesos(costoMensual(m).reduce((a, c) => a + c.v, 0))}</strong> },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="text-ink-2">
          Elegí hasta {MAX} para compararlas lado a lado.
        </p>
      </div>
      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {lista.map((m) => {
            const sel = elegidos.includes(m.id);
            const lleno = !sel && elegidos.length >= MAX;
            return (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className={cn("relative rounded-[1.5rem] transition-shadow", sel && "ring-4 ring-brand-deco ring-offset-2 ring-offset-bg")}
              >
                <TarjetaMascota
                  m={m}
                  morph
                  extra={
                    <label className={cn("relative z-[3] mt-3 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors", sel ? "border-brand bg-accent-soft text-brand" : "border-line hover:border-ink", lleno && "cursor-not-allowed opacity-50")}>
                      <input type="checkbox" className="size-4 accent-[var(--accent)]" checked={sel} disabled={lleno} onChange={() => alternar(m.id)} />
                      {sel ? "Para comparar" : "Comparar"}
                    </label>
                  }
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {seleccion.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-3 bottom-[calc(var(--bottomnav-h)+0.75rem)] z-40 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-card p-3 shadow-e3 lg:bottom-6"
          >
            <div className="flex -space-x-3">
              {seleccion.map((m) => (
                <span key={m.id} className="relative size-11 overflow-hidden rounded-full border-2 border-card">
                  <Image src={m.foto} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ))}
            </div>
            <p className="flex-1 text-sm font-semibold">
              {seleccion.length} de {MAX} elegidas
            </p>
            <button type="button" className="btn btn-fantasma btn-sm" onClick={() => setElegidos([])}>
              Limpiar
            </button>
            <button type="button" className="btn btn-primario btn-sm" disabled={seleccion.length < 2} onClick={() => setAbierto(true)}>
              <Columns3 className="size-4" aria-hidden="true" /> Comparar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog.Root open={abierto} onOpenChange={setAbierto}>
        <Dialog.Portal>
          <Dialog.Overlay className="dlg-overlay" />
          <Dialog.Content className="dlg dlg-grande !w-[min(100%-2rem,64rem)] p-5 md:p-8" aria-describedby={undefined}>
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="t-h3">Comparar favoritos</Dialog.Title>
              <Dialog.Close className="icon-btn" aria-label="Cerrar comparación">
                <X className="size-6" />
              </Dialog.Close>
            </div>
            <div className="tabla-wrap">
              <table className="tabla">
                <caption className="sr-only">Comparación de {seleccion.map((m) => m.nombre).join(", ")}</caption>
                <thead>
                  <tr>
                    <td />
                    {seleccion.map((m) => (
                      <th key={m.id} scope="col" className="!align-bottom">
                        <span className="relative mb-2 block aspect-[4/3] w-full min-w-32 overflow-hidden rounded-xl">
                          <Image src={m.foto} alt="" fill sizes="16rem" className="object-cover" />
                        </span>
                        <Link href={`/mascota/${m.id}`} className="enlace text-lg">
                          {m.nombre}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.t}>
                      <th scope="row">{f.t}</th>
                      {seleccion.map((m) => (
                        <td key={m.id}>{f.v(m)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">
                      <span className="sr-only">Acciones</span>
                    </th>
                    {seleccion.map((m) => (
                      <td key={m.id}>
                        <Link href={`/adoptar/${m.id}`} className="btn btn-primario btn-sm">
                          Adoptar
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
