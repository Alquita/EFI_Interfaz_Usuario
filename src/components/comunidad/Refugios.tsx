"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, MapPin, Navigation, PawPrint, Phone } from "lucide-react";
import type { Necesidad, RefugioId } from "@/types";
import { LISTA_REFUGIOS } from "@/data/refugios";
import { MASCOTAS } from "@/data/mascotas";
import { cn } from "@/lib/utils";
import { MapaRefugios } from "@/components/mapa/MapaRefugios";
import { Aparecer } from "@/components/ui/Movimiento";

export function BarrasNecesidad({ necesidades, retraso = 0 }: { necesidades: Necesidad[]; retraso?: number }) {
  return (
    <ul className="grid gap-3">
      {necesidades.map((n, i) => (
        <li key={n.item}>
          <div className="mb-1.5 flex justify-between gap-3 text-[0.9375rem]">
            <span>{n.item}</span>
            <span className="font-semibold tabular-nums">{n.porcentaje}%</span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-valuenow={n.porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${n.item}: ${n.porcentaje}% cubierto`}
          >
            <motion.div
              className={cn("h-full rounded-full", n.porcentaje < 40 ? "bg-gradient-to-r from-[#b91c1c] to-accent" : "bg-gradient-to-r from-accent to-brand-deco")}
              initial={{ width: 0 }}
              whileInView={{ width: `${n.porcentaje}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: retraso + i * 0.12 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ListaRefugios() {
  const [activo, setActivo] = useState<RefugioId | "">("");
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <MapaRefugios className="h-[22rem] md:h-[28rem] lg:h-[calc(100dvh-var(--header-h)-3rem)]" activo={activo} onSeleccionar={setActivo} />
        <p className="mt-3 text-sm text-ink-2">El punto azul es tu ubicación aproximada (Banda Norte). Tocá un refugio para centrarlo.</p>
      </div>
      <ul className="grid gap-6">
        {LISTA_REFUGIOS.map((r, i) => {
          const suyas = MASCOTAS.filter((m) => m.refugio === r.id);
          const sel = activo === r.id;
          return (
            <Aparecer key={r.id} como="li" retraso={i * 0.08}>
              <article
                className={cn("tarjeta overflow-hidden transition-[box-shadow,border-color]", sel && "!border-brand shadow-e3")}
                onMouseEnter={() => setActivo(r.id)}
                onFocus={() => setActivo(r.id)}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image src={r.foto} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
                    <h2 className="t-h3">{r.nombre}</h2>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
                      {String(r.distancia).replace(".", ",")} km
                    </span>
                  </div>
                </div>
                <div className="grid gap-5 p-6">
                  <p className="text-ink-2">{r.descripcion}</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <MapPin className="size-4 text-brand" aria-hidden="true" /> {r.barrio}
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="size-4 text-brand" aria-hidden="true" /> {r.especies}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="size-4 text-brand" aria-hidden="true" /> {r.horario}
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="size-4 text-brand" aria-hidden="true" /> {r.telefono}
                    </li>
                  </ul>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {suyas.slice(0, 5).map((m) => (
                        <span key={m.id} className="relative size-10 overflow-hidden rounded-full border-2 border-card">
                          <Image src={m.foto} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-ink-2">
                      <strong className="text-ink">{suyas.length}</strong> en adopción
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="mb-3 font-semibold">Qué necesita esta semana</p>
                    <BarrasNecesidad necesidades={r.necesidades} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/refugios/${r.id}`} className="btn btn-primario btn-sm">
                      Ver refugio <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${r.coordenadas.join(",")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secundario btn-sm"
                    >
                      <Navigation className="size-4" aria-hidden="true" /> Cómo llegar
                    </a>
                    <a href={`tel:${r.telefono.replace(/\s/g, "")}`} className="btn btn-fantasma btn-sm">
                      <Phone className="size-4" aria-hidden="true" /> Llamar
                    </a>
                  </div>
                </div>
              </article>
            </Aparecer>
          );
        })}
      </ul>
    </div>
  );
}
