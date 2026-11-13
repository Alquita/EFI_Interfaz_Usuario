"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { ArrowRight, Quote, X } from "lucide-react";
import type { Historia } from "@/types";
import { HISTORIAS } from "@/data/historias";
import { REFUGIOS } from "@/data/refugios";
import { cn } from "@/lib/utils";

export function Historias() {
  const [especie, setEspecie] = useState<"" | "perro" | "gato">("");
  const [abierta, setAbierta] = useState<Historia | null>(null);
  useLayoutEffect(() => () => setAbierta(null), []);
  const [destacada, ...resto] = HISTORIAS;
  const lista = resto.filter((h) => !especie || h.especie === especie);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setAbierta(destacada)}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group grid w-full overflow-hidden rounded-[2rem] bg-brown text-left text-white lg:grid-cols-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[28rem]">
          <Image src={destacada.foto} alt={destacada.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="relative flex flex-col justify-center p-8 md:p-12">
          <Quote className="size-12 text-[#fdba74]" aria-hidden="true" />
          <p className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">“{destacada.cita}”</p>
          <p className="mt-6 text-[#e7d9d1]">{destacada.resumen}</p>
          <p className="mt-6 font-semibold">
            {destacada.quienes} · {destacada.mascota} · {destacada.fecha}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 font-semibold text-[#fdba74]">
            Leer la historia <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </motion.button>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
        <h2 className="t-h3">Más historias</h2>
        <div className="pestanas" role="group" aria-label="Filtrar historias">
          {(
            [
              { v: "", t: "Todas" },
              { v: "perro", t: "Perros" },
              { v: "gato", t: "Gatos" },
            ] as const
          ).map((o) => (
            <button key={o.v} type="button" className="pestana" aria-pressed={especie === o.v} onClick={() => setEspecie(o.v)}>
              {especie === o.v && <motion.span layoutId="hist-tab" className="pestana-fondo" />}
              <span className={cn(especie === o.v && "text-brand")}>{o.t}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {lista.map((h, i) => (
            <motion.li key={h.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="break-inside-avoid">
              <button type="button" onClick={() => setAbierta(h)} className="tarjeta eleva group block w-full overflow-hidden text-left">
                <div className={cn("relative overflow-hidden", i % 2 ? "aspect-[4/5]" : "aspect-[4/3]")}>
                  <Image src={h.foto} alt={h.alt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur">{h.fecha}</span>
                </div>
                <div className="p-6">
                  <h3 className="t-h4">{h.titulo}</h3>
                  <p className="mt-2 text-ink-2">{h.resumen}</p>
                  <p className="mt-4 text-sm font-semibold text-brand">{REFUGIOS[h.refugio].nombre}</p>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Dialog.Root open={!!abierta} onOpenChange={(v) => !v && setAbierta(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="dlg-overlay" />
          {abierta && (
            <Dialog.Content className="dlg dlg-grande overflow-hidden !p-0">
              <div className="relative aspect-[16/9]">
                <Image src={abierta.foto} alt={abierta.alt} fill sizes="48rem" className="object-cover" />
                <Dialog.Close className="icon-btn icon-btn-vidrio absolute right-4 top-4" aria-label="Cerrar historia">
                  <X className="size-6" />
                </Dialog.Close>
              </div>
              <div className="p-6 md:p-10">
                <p className="t-eyebrow !text-sm">
                  {abierta.fecha} · {REFUGIOS[abierta.refugio].nombre}
                </p>
                <Dialog.Title className="t-h2 mt-2">{abierta.titulo}</Dialog.Title>
                <Dialog.Description className="t-lead mt-4">{abierta.resumen}</Dialog.Description>
                <blockquote className="mt-6 border-l-4 border-brand-deco pl-5 text-xl font-medium">
                  “{abierta.cita}”
                  <footer className="mt-2 text-base font-normal text-ink-2">— {abierta.quienes}</footer>
                </blockquote>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/refugios/${abierta.refugio}`} className="btn btn-primario" onClick={() => setAbierta(null)}>
                    Conocer {REFUGIOS[abierta.refugio].nombre}
                  </Link>
                  <Link href={`/?especie=${abierta.especie}#mascotas`} className="btn btn-secundario" onClick={() => setAbierta(null)}>
                    Ver {abierta.especie === "perro" ? "perros" : "gatos"} en adopción
                  </Link>
                </div>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
