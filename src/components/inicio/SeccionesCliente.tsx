"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import type { RefugioId } from "@/types";
import { LISTA_REFUGIOS } from "@/data/refugios";
import { MASCOTAS } from "@/data/mascotas";
import { PREGUNTAS } from "@/data/preguntas";
import { cn } from "@/lib/utils";
import { MapaRefugios } from "@/components/mapa/MapaRefugios";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer } from "@/components/ui/Movimiento";

export function RefugiosCercanos() {
  const [activo, setActivo] = useState<RefugioId | "">("");
  return (
    <section className="seccion" aria-labelledby="t-refugios">
      <div className="contenedor">
        <EncabezadoSeccion
          id="t-refugios"
          antetitulo="Refugios aliados"
          titulo="Tres refugios, un solo mapa."
          resaltar={["un", "solo", "mapa."]}
          bajada="Horarios, teléfonos y qué necesitan esta semana. Tocá un refugio para verlo en el mapa."
          accion={{ href: "/refugios", texto: "Abrir el mapa" }}
        />
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Aparecer desde="escala">
            <MapaRefugios className="h-[24rem] lg:h-full lg:min-h-[32rem]" activo={activo} onSeleccionar={setActivo} />
          </Aparecer>
          <ul className="grid gap-4">
            {LISTA_REFUGIOS.map((r, i) => {
              const cuantos = MASCOTAS.filter((m) => m.refugio === r.id).length;
              const necesidad = [...r.necesidades].sort((a, b) => a.porcentaje - b.porcentaje)[0];
              const sel = activo === r.id;
              return (
                <Aparecer key={r.id} como="li" retraso={i * 0.08} desde="derecha">
                  <button
                    type="button"
                    onClick={() => setActivo(sel ? "" : r.id)}
                    aria-pressed={sel}
                    className={cn(
                      "tarjeta eleva w-full cursor-pointer p-5 text-left",
                      sel && "!border-brand shadow-e2 ring-2 ring-brand/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="t-h4">{r.nombre}</p>
                        <p className="mt-0.5 text-sm text-ink-2">
                          {r.especies} · {cuantos} en adopción
                        </p>
                      </div>
                      <span className="estado estado-neutro shrink-0">
                        <MapPin className="size-4" aria-hidden="true" />
                        {String(r.distancia).replace(".", ",")} km
                      </span>
                    </div>
                    <div className="mt-3 grid gap-1 text-[0.9375rem] text-ink-2">
                      <span className="flex items-center gap-2">
                        <Clock className="size-4 text-brand" aria-hidden="true" /> {r.horario}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="size-4 text-brand" aria-hidden="true" /> {r.telefono}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>Necesita: {necesidad.item.toLowerCase()}</span>
                        <span className="font-semibold">{necesidad.porcentaje}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-brand-deco"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${necesidad.porcentaje}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </button>
                </Aparecer>
              );
            })}
            <li>
              <Link href="/sumar-refugio" className="btn btn-fantasma btn-bloque">
                ¿Tenés un refugio? Sumalo gratis <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PreguntasInicio() {
  const preguntas = PREGUNTAS.filter((p) => p.cat === "adoptar").slice(0, 5);
  return (
    <section className="seccion" aria-labelledby="t-faq">
      <div className="contenedor grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <EncabezadoSeccion
            id="t-faq"
            className="!mb-8"
            antetitulo="Preguntas frecuentes"
            titulo="Lo que todos preguntan antes de adoptar."
            bajada="Si no encontrás tu respuesta, escribinos y te contestamos en el día."
          />
          <Aparecer className="panel-marca flex items-center gap-4 p-5">
            <span className="icono-modal">
              <MessageCircle className="size-6" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">¿Te quedó alguna duda?</p>
              <p className="text-sm text-ink-2">Mirá todas las preguntas o escribinos.</p>
            </div>
          </Aparecer>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/ayuda" className="btn btn-secundario">
              Ver todas
            </Link>
            <Link href="/contacto" className="btn btn-fantasma">
              Escribinos
            </Link>
          </div>
        </div>
        <Accordion.Root type="single" collapsible defaultValue="p0" className="border-t border-line">
          {preguntas.map((p, i) => (
            <Aparecer key={p.p} retraso={i * 0.06}>
              <Accordion.Item value={`p${i}`} className="acordeon-item">
                <Accordion.Header>
                  <Accordion.Trigger className="acordeon-disparador">
                    {p.p}
                    <Plus className="size-5" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="acordeon-contenido">
                  <p className="max-w-2xl px-1 pb-5 leading-7">{p.r}</p>
                </Accordion.Content>
              </Accordion.Item>
            </Aparecer>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
