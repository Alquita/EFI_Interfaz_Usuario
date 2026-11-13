"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Gift, HandHeart, Heart, X } from "lucide-react";
import { APADRINABLES, DATOS_TRANSFERENCIA, DESTINOS_DONACION, MONTOS_DONACION } from "@/data/comunidad";
import { MASCOTAS } from "@/data/mascotas";
import { LISTA_REFUGIOS, REFUGIOS } from "@/data/refugios";
import { acciones, useEstado } from "@/lib/store";
import { cn, diasDesde, pesos } from "@/lib/utils";
import { ICONOS } from "@/components/ui/Marca";

const IMPACTO: Record<string, (n: number) => string> = {
  castraciones: (n) => `≈ ${Math.max(1, Math.floor(n / 8000))} castración${n >= 16000 ? "es" : ""}`,
  veterinaria: (n) => `≈ ${Math.max(1, Math.floor(n / 2500))} vacunas`,
  alimento: (n) => `≈ ${Math.max(1, Math.round(n / 1600))} kg de alimento`,
};

function Copiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="icon-btn icon-btn-borde shrink-0"
      aria-label={`Copiar ${etiqueta}`}
      onClick={async () => {
        await navigator.clipboard.writeText(texto);
        setOk(true);
        toast.success(`Copiamos el ${etiqueta}`);
        setTimeout(() => setOk(false), 1600);
      }}
    >
      {ok ? <Check className="size-5 text-success" /> : <Copy className="size-5" />}
    </button>
  );
}

export function Donar() {
  const [monto, setMonto] = useState(5000);
  const [otro, setOtro] = useState("");
  const [mensual, setMensual] = useState(false);
  const [destino, setDestino] = useState<string>("castraciones");
  const [refugio, setRefugio] = useState("huellitas");
  const [abierto, setAbierto] = useState(false);
  useLayoutEffect(() => () => setAbierto(false), []);
  const final = otro ? Number(otro) || 0 : monto;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="tarjeta grid gap-7 p-6 md:p-8">
        <div className="segmentado !w-fit !bg-surface" role="group" aria-label="Frecuencia">
          {[
            { v: false, t: "Una vez" },
            { v: true, t: "Todos los meses" },
          ].map((o) => (
            <button key={o.t} type="button" aria-pressed={mensual === o.v} onClick={() => setMensual(o.v)} className="!px-5 !text-ink">
              {mensual === o.v && <motion.span layoutId="don-frec" className="segmento-fondo !bg-accent" />}
              <span className={cn(mensual === o.v && "text-white")}>{o.t}</span>
            </button>
          ))}
        </div>
        <fieldset>
          <legend className="etiqueta mb-3">Monto</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MONTOS_DONACION.map((m) => (
              <label key={m} className="opcion">
                <input type="radio" name="monto" checked={!otro && monto === m} onChange={() => { setMonto(m); setOtro(""); }} />
                <span className="opcion-caja justify-center text-lg font-bold tabular-nums">{pesos(m)}</span>
              </label>
            ))}
          </div>
          <label htmlFor="don-otro" className="etiqueta mt-4 block">
            Otro monto <span className="opcional">(opcional)</span>
          </label>
          <div className="grupo-input mt-2 max-w-xs">
            <span className="icono-izq font-semibold" aria-hidden="true">$</span>
            <input id="don-otro" className="input" inputMode="numeric" value={otro} onChange={(e) => setOtro(e.target.value.replace(/\D/g, ""))} placeholder="15000" />
          </div>
        </fieldset>
        <fieldset>
          <legend className="etiqueta mb-3">¿Para qué?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {DESTINOS_DONACION.map((d) => {
              const I = ICONOS[d.icono];
              return (
                <label key={d.id} className="opcion">
                  <input type="radio" name="destino" checked={destino === d.id} onChange={() => setDestino(d.id)} />
                  <span className="opcion-caja h-full !flex-col !items-start !gap-2">
                    <I className="size-6" aria-hidden="true" />
                    <span className="font-semibold">{d.titulo}</span>
                    <span className="text-sm text-ink-2">{d.texto}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="campo max-w-sm">
          <label htmlFor="don-ref" className="etiqueta">
            Refugio
          </label>
          <select id="don-ref" className="select" value={refugio} onChange={(e) => setRefugio(e.target.value)}>
            {LISTA_REFUGIOS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="panel-marron relative overflow-hidden p-8">
          <div className="textura-huellas absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <p className="text-[#e7d9d1]">Vas a donar</p>
            <motion.p key={final + String(mensual)} initial={{ opacity: 0.4, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-5xl font-bold tracking-tight tabular-nums">
              {pesos(final)}
              {mensual && <span className="text-xl font-medium text-[#e7d9d1]"> /mes</span>}
            </motion.p>
            <p className="mt-4 text-lg">
              Para <strong>{DESTINOS_DONACION.find((d) => d.id === destino)?.titulo.toLowerCase()}</strong> en {REFUGIOS[refugio as keyof typeof REFUGIOS].nombre}.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[#fdba74]">
              <Heart className="size-4 fill-current" aria-hidden="true" /> {IMPACTO[destino](final)}
            </p>
            <button type="button" className="btn btn-blanco btn-lg btn-bloque mt-8" disabled={final < 500} onClick={() => setAbierto(true)}>
              <Gift className="size-5" aria-hidden="true" /> Donar {pesos(final)}
            </button>
            <p className="mt-3 text-center text-sm text-[#e7d9d1]">Transferencia directa al refugio. Sin comisiones.</p>
          </div>
        </div>
      </div>

      <Dialog.Root open={abierto} onOpenChange={setAbierto}>
        <Dialog.Portal>
          <Dialog.Overlay className="dlg-overlay" />
          <Dialog.Content className="dlg p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="icono-modal">
                <HandHeart className="size-6" aria-hidden="true" />
              </span>
              <Dialog.Close className="icon-btn" aria-label="Cerrar">
                <X className="size-6" />
              </Dialog.Close>
            </div>
            <Dialog.Title className="t-h3 mt-4">¡Gracias! Transferí {pesos(final)}</Dialog.Title>
            <Dialog.Description className="mt-2 text-ink-2">
              Usá estos datos desde tu banco o billetera. En el concepto poné “{destino}”. (Datos de ejemplo de esta demo.)
            </Dialog.Description>
            <dl className="mt-6 grid gap-3">
              {[
                ["Titular", DATOS_TRANSFERENCIA.titular, false],
                ["Alias", DATOS_TRANSFERENCIA.alias, true],
                ["CBU", DATOS_TRANSFERENCIA.cbu, true],
              ].map(([t, v, c]) => (
                <div key={String(t)} className="flex items-center gap-3 rounded-xl bg-surface p-4">
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm text-ink-2">{t}</dt>
                    <dd className="break-all font-semibold tabular-nums">{v}</dd>
                  </div>
                  {c && <Copiar texto={String(v)} etiqueta={String(t)} />}
                </div>
              ))}
            </dl>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export function Apadrinar() {
  const { padrinazgos } = useEstado();
  const lista = APADRINABLES.map((id) => MASCOTAS.find((m) => m.id === id)!);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {lista.map((m, i) => {
        const ya = padrinazgos.includes(m.id);
        return (
          <motion.li key={m.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="tarjeta overflow-hidden">
            <Link href={`/mascota/${m.id}`} className="group relative block aspect-[4/3.6] overflow-hidden">
              <Image src={m.foto} alt={m.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 insignia">Hace {diasDesde(m.publicado)} días esperando</span>
            </Link>
            <div className="p-5">
              <p className="t-h4">{m.nombre}</p>
              <p className="text-sm text-ink-2">
                {m.edad} · {REFUGIOS[m.refugio].nombre}
              </p>
              <p className="mt-3 text-sm">Con {pesos(8000)}/mes cubrís su alimento y controles mientras espera familia.</p>
              <button
                type="button"
                className={cn("btn btn-sm btn-bloque mt-4", ya ? "btn-secundario" : "btn-primario")}
                aria-pressed={ya}
                onClick={() => {
                  if (ya) return;
                  acciones.apadrinar(m.id);
                  toast.success(`¡Ahora apadrinás a ${m.nombre}!`, { description: "Te mandamos fotos y novedades cada mes." });
                }}
              >
                {ya ? <Check className="size-4" aria-hidden="true" /> : <Heart className="size-4" aria-hidden="true" />}
                {ya ? `Apadrinás a ${m.nombre}` : `Apadrinar a ${m.nombre}`}
              </button>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
