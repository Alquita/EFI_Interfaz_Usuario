"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type PointerEvent } from "react";
import { Cat, Dog, MapPin } from "lucide-react";
import type { Mascota } from "@/types";
import { cn, esNueva, etapaDe, NOMBRE_ETAPA, NOMBRE_TAMANO } from "@/lib/utils";
import { REFUGIOS } from "@/data/refugios";
import { BotonFavorito } from "./BotonFavorito";

export function seguirCursor(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function TarjetaMascota({
  m,
  className,
  prioridad = false,
  extra,
  morph = false,
}: {
  m: Mascota;
  className?: string;
  prioridad?: boolean;
  /** contenido opcional debajo (p. ej. % de compatibilidad) */
  extra?: React.ReactNode;
  /** transición compartida foto → ficha (solo una tarjeta por mascota en pantalla) */
  morph?: boolean;
}) {
  const Icono = m.especie === "perro" ? Dog : Cat;
  const imagen = (
    <Image
      src={m.foto}
      alt={m.alt}
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
      loading={prioridad ? "eager" : "lazy"}
    />
  );
  return (
    <article className={cn("tarjeta-mascota con-reflejo group", className)} onPointerMove={seguirCursor}>
      <div className="media">
        {morph ? (
          <ViewTransition name={`foto-${m.id}`} share="morph" default="none">
            {imagen}
          </ViewTransition>
        ) : (
          imagen
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="insignias">
          {esNueva(m) && <span className="insignia insignia-nueva">Nuevo</span>}
          {m.estado === "reservado" && <span className="insignia insignia-reservada">Reservado</span>}
          {m.edadMeses >= 96 && <span className="insignia">Senior</span>}
        </div>
        <div className="ficha-hover" aria-hidden="true">
          <span>{m.peso}</span>
          <span>{NOMBRE_TAMANO[m.tamano]}</span>
          <span>{m.castrado ? (m.sexo === "hembra" ? "Castrada" : "Castrado") : "Sin castrar"}</span>
        </div>
      </div>
      <span className="reflejo" aria-hidden="true" />
      <BotonFavorito id={m.id} nombre={m.nombre} className="fav" />

      <div className="relative flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="t-h4 !text-[1.3rem] !leading-7">
            <Link href={`/mascota/${m.id}`} className="enlace-tarjeta">
              {m.nombre}
            </Link>
          </h3>
          <span
            className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-brand"
            title={m.especie === "perro" ? "Perro" : "Gato"}
          >
            <Icono className="size-[1.1rem]" aria-hidden="true" />
            <span className="sr-only">{m.especie === "perro" ? "Perro" : "Gato"}</span>
          </span>
        </div>
        <p className="text-ink-2">
          {m.tipo} · {m.edad} · {NOMBRE_ETAPA[etapaDe(m.edadMeses)]}
        </p>
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-[0.9375rem] text-ink-2">
          <MapPin className="size-4 text-brand" aria-hidden="true" />
          {m.barrio} · a {m.distancia.toString().replace(".", ",")} km
          <span className="sr-only">· {REFUGIOS[m.refugio].nombre}</span>
        </p>
        {extra}
      </div>
    </article>
  );
}

export function EsqueletoTarjeta() {
  return (
    <div className="tarjeta-mascota" aria-hidden="true">
      <div className="esqueleto aspect-[4/3.4] !rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="esqueleto h-6 w-1/2" />
        <div className="esqueleto h-4 w-4/5" />
        <div className="esqueleto h-4 w-2/3" />
      </div>
    </div>
  );
}
