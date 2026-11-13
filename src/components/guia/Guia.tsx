"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleCheck, CircleHelp, RotateCcw, Sparkles } from "lucide-react";
import { CHECKLIST, COSTOS, PREGUNTAS_TEST, PREPARAR_CASA, PRIMEROS_DIAS, type Respuestas } from "@/data/guia";
import { MASCOTAS } from "@/data/mascotas";
import { acciones, useEstado } from "@/lib/store";
import { cn, compatibilidad, pesos } from "@/lib/utils";
import { Contador } from "@/components/ui/Movimiento";

/* ------------------------------------------------------------------ Navegación con scrollspy */
const SECCIONES = [
  { id: "checklist", t: "Checklist" },
  { id: "test", t: "Test" },
  { id: "costos", t: "Costos" },
  { id: "preparar", t: "Preparar la casa" },
  { id: "primeros-dias", t: "Primeros días" },
];

export function NavGuia() {
  const [activa, setActiva] = useState("checklist");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiva(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav aria-label="Secciones de la guía" className="sticky top-[calc(var(--header-h)+0.75rem)] z-30 mx-auto w-fit max-w-full">
      <ul className="pestanas border border-line !bg-bg/85 shadow-e2 backdrop-blur-lg">
        {SECCIONES.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="pestana inline-flex items-center no-underline" aria-current={activa === s.id ? "true" : undefined}>
              {activa === s.id && <motion.span layoutId="guia-nav" className="pestana-fondo !bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className={cn(activa === s.id && "text-white")}>{s.t}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ Checklist */
export function Checklist() {
  const { checklist } = useEstado();
  const p = Math.round((checklist.length / CHECKLIST.length) * 100);
  const mensaje =
    p === 100 ? "¡Estás listo/a! Ya podés buscar a tu compañero." : p >= 60 ? "Vas muy bien. Revisá lo que falta con calma." : "Tomate tu tiempo: adoptar es un compromiso largo.";
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <ul className="grid gap-3 sm:grid-cols-2">
        {CHECKLIST.map((c, i) => {
          const hecho = checklist.includes(i);
          return (
            <li key={c}>
              <label className="opcion h-full">
                <input type="checkbox" checked={hecho} onChange={() => acciones.alternarChecklist(i)} />
                <span className="opcion-caja h-full">
                  <span className={cn("transition-colors", hecho && "text-ink-2 line-through decoration-brand-deco decoration-2")}>{c}</span>
                  <span className="opcion-marca cuadrada" aria-hidden="true" />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="tarjeta grid content-start place-items-center gap-4 p-6 text-center lg:sticky lg:top-40">
        <div className="relative size-36">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-2)" strokeWidth="12" />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--brand-deco)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: p / 100 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-3xl font-bold" aria-live="polite">
            {p}%
          </span>
        </div>
        <p className="font-semibold">
          {checklist.length} de {CHECKLIST.length} listos
        </p>
        <p className="text-sm text-ink-2">{mensaje}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Test de compatibilidad */
export function TestCompatibilidad() {
  const { test } = useEstado();
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<Partial<Respuestas>>({});
  const [rehaciendo, setRehaciendo] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const resultado = test && !rehaciendo ? test : null;

  const elegir = (id: keyof Respuestas, valor: string) => {
    const nuevas = { ...resp, [id]: valor };
    setResp(nuevas);
    setTimeout(() => {
      if (paso < PREGUNTAS_TEST.length - 1) {
        setPaso((p) => p + 1);
        titulo.current?.focus();
      } else {
        acciones.guardarTest(nuevas);
        setRehaciendo(false);
      }
    }, 260);
  };

  if (resultado) {
    const ranking = MASCOTAS.filter((m) => m.estado === "disponible")
      .map((m) => ({ m, c: compatibilidad(m, resultado) }))
      .sort((a, b) => b.c.puntos - a.c.puntos)
      .slice(0, 3);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-5 text-brand" aria-hidden="true" /> Tus 3 mejores matches
          </p>
          <button
            type="button"
            className="btn btn-fantasma btn-sm"
            onClick={() => {
              setResp({});
              setPaso(0);
              setRehaciendo(true);
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Rehacer el test
          </button>
        </div>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {ranking.map(({ m, c }, i) => (
            <motion.li key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
              <Link href={`/mascota/${m.id}`} className="tarjeta eleva group block overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={m.foto} alt={m.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-accent font-bold text-white shadow-marca">{i + 1}</span>
                </div>
                <div className="flex items-start gap-4 p-5">
                  <span className="anillo !size-16" style={{ ["--p" as string]: c.puntos }}>
                    <span className="text-sm">{c.puntos}%</span>
                  </span>
                  <div className="min-w-0">
                    <p className="t-h4">{m.nombre}</p>
                    <p className="text-sm text-ink-2">
                      {m.tipo} · {m.edad}
                    </p>
                    <ul className="mt-2 grid gap-1 text-sm">
                      {c.motivos.slice(0, 2).map((x) => (
                        <li key={x} className="flex items-center gap-1.5 text-success">
                          <CircleCheck className="size-4 shrink-0" aria-hidden="true" /> {x}
                        </li>
                      ))}
                      {c.alertas.slice(0, 1).map((x) => (
                        <li key={x} className="flex items-center gap-1.5 text-review">
                          <CircleHelp className="size-4 shrink-0" aria-hidden="true" /> {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ol>
        <p className="mt-6 text-ink-2">
          Ahora ves tu % de compatibilidad en cada ficha y en{" "}
          <Link href="/descubrir" className="enlace">
            Descubrir
          </Link>
          .
        </p>
      </motion.div>
    );
  }

  const q = PREGUNTAS_TEST[paso];
  return (
    <div className="tarjeta mx-auto max-w-3xl overflow-hidden">
      <div className="h-1.5 bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={PREGUNTAS_TEST.length} aria-valuenow={paso + 1} aria-label="Progreso del test">
        <motion.div className="h-full bg-gradient-to-r from-accent to-brand-deco" animate={{ width: `${((paso + 1) / PREGUNTAS_TEST.length) * 100}%` }} />
      </div>
      <div className="p-6 md:p-10">
        <p className="text-sm font-semibold text-ink-2">
          Pregunta {paso + 1} de {PREGUNTAS_TEST.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.fieldset key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <legend className="contents">
              <h3 ref={titulo} tabIndex={-1} className="t-h2 mt-2 outline-none">
                {q.pregunta}
              </h3>
            </legend>
            <div className={cn("mt-6 grid gap-3", q.opciones.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
              {q.opciones.map((o) => (
                <label key={o.valor} className="opcion">
                  <input type="radio" name={q.id} value={o.valor} checked={resp[q.id] === o.valor} onChange={() => elegir(q.id, o.valor)} />
                  <span className="opcion-caja !min-h-16 text-lg font-semibold">
                    {o.texto}
                    <span className="opcion-marca" aria-hidden="true" />
                  </span>
                </label>
              ))}
            </div>
          </motion.fieldset>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          <button type="button" className="btn btn-fantasma btn-sm" disabled={paso === 0} onClick={() => setPaso((p) => p - 1)}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Anterior
          </button>
          {resp[q.id] && paso < PREGUNTAS_TEST.length - 1 && (
            <button type="button" className="btn btn-secundario btn-sm" onClick={() => setPaso((p) => p + 1)}>
              Siguiente <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Calculadora de costos */
export function Calculadora() {
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [tamano, setTamano] = useState<"pequeno" | "mediano" | "grande">("mediano");
  const [extras, setExtras] = useState<string[]>([]);

  const partes = [
    { t: "Alimento", v: especie === "gato" ? COSTOS.alimento.gato : COSTOS.alimento[tamano], c: "#c2410c" },
    { t: especie === "gato" ? "Piedras sanitarias" : "Higiene", v: especie === "gato" ? COSTOS.higiene.gato : COSTOS.higiene.perro, c: "#f97316" },
    { t: "Antiparasitarios", v: COSTOS.antiparasitarios, c: "#fdba74" },
    { t: "Veterinaria", v: COSTOS.veterinaria, c: "#15803d" },
    ...COSTOS.extras.filter((e) => extras.includes(e.id)).map((e, i) => ({ t: e.texto, v: e.valor, c: ["#1d4ed8", "#92400e", "#7c2d12", "#4a4a4a"][i % 4] })),
  ];
  const total = partes.reduce((a, p) => a + p.v, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid content-start gap-6">
        <fieldset>
          <legend className="etiqueta mb-3">Especie</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["perro", "gato"] as const).map((e) => (
              <label key={e} className="opcion">
                <input type="radio" name="calc-especie" checked={especie === e} onChange={() => setEspecie(e)} />
                <span className="opcion-caja capitalize">
                  {e}
                  <span className="opcion-marca" aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <AnimatePresence initial={false}>
          {especie === "perro" && (
            <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <legend className="etiqueta mb-3">Tamaño</legend>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["pequeno", "Pequeño"],
                    ["mediano", "Mediano"],
                    ["grande", "Grande"],
                  ] as const
                ).map(([v, t]) => (
                  <label key={v} className="opcion">
                    <input type="radio" name="calc-tamano" checked={tamano === v} onChange={() => setTamano(v)} />
                    <span className="opcion-caja justify-center">{t}</span>
                  </label>
                ))}
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>
        <fieldset>
          <legend className="etiqueta mb-3">Extras opcionales</legend>
          <div className="flex flex-wrap gap-2">
            {COSTOS.extras.map((e) => {
              const sel = extras.includes(e.id);
              return (
                <button key={e.id} type="button" className="chip sin-pildora" aria-pressed={sel} onClick={() => setExtras((x) => (sel ? x.filter((y) => y !== e.id) : [...x, e.id]))}>
                  {sel && <Check className="size-4" aria-hidden="true" />}
                  {e.texto}
                </button>
              );
            })}
          </div>
        </fieldset>
        <p className="text-sm text-ink-2">Valores de ejemplo en pesos argentinos (noviembre 2026). Pueden variar según la marca y la veterinaria.</p>
      </div>

      <div className="tarjeta-corte p-6 md:p-8">
        <p className="text-ink-2">Costo mensual estimado</p>
        <p className="mt-1 text-5xl font-bold tracking-tight text-brand tabular-nums md:text-6xl" aria-live="polite">
          <motion.span key={total} initial={{ opacity: 0.4, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
            {pesos(total)}
          </motion.span>
        </p>
        <p className="mt-1 text-ink-2">
          ≈ <strong className="text-ink">{pesos(total * 12)}</strong> por año
        </p>
        <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          {partes.map((p) => (
            <motion.span key={p.t} layout className="h-full" style={{ background: p.c }} animate={{ width: `${(p.v / total) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          ))}
        </div>
        <ul className="mt-6 grid gap-2.5">
          <AnimatePresence initial={false}>
            {partes.map((p) => (
              <motion.li key={p.t} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full" style={{ background: p.c }} aria-hidden="true" />
                  {p.t}
                </span>
                <span className="font-semibold tabular-nums">{pesos(p.v)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Preparar la casa */
export function PrepararCasa() {
  const [tab, setTab] = useState("perros");
  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List className="pestanas" aria-label="Para quién preparás la casa">
        {[
          ["perros", "Para un perro"],
          ["gatos", "Para un gato"],
        ].map(([v, t]) => (
          <Tabs.Trigger key={v} value={v} className="pestana">
            {tab === v && <motion.span layoutId="prep-tab" className="pestana-fondo" />}
            {t}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {(["perros", "gatos"] as const).map((k) => (
        <Tabs.Content key={k} value={k} className="mt-8">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="forma-hoja relative aspect-[4/3] overflow-hidden">
              <Image
                src={k === "perros" ? "/img/varios/voluntaria.jpg" : "/img/varios/gato-mano.jpg"}
                alt={k === "perros" ? "Perro golden en una casa junto a una persona" : "Gato recibiendo mimos en el cuello"}
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <ul className="grid gap-3">
              {PREPARAR_CASA[k].map((x, i) => (
                <motion.li
                  key={x}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                    <Check className="size-5" aria-hidden="true" />
                  </span>
                  {x}
                </motion.li>
              ))}
            </ul>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

/* ------------------------------------------------------------------ Primeros días (línea que se dibuja) */
export function PrimerosDias() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <ol ref={ref} className="relative mx-auto grid max-w-3xl gap-10 pl-12 md:pl-16">
      <span className="absolute bottom-2 left-[1.15rem] top-2 w-[3px] rounded-full bg-surface-2 md:left-[1.65rem]" aria-hidden="true" />
      <motion.span className="absolute bottom-2 left-[1.15rem] top-2 w-[3px] origin-top rounded-full bg-gradient-to-b from-accent to-brand-deco md:left-[1.65rem]" style={{ scaleY: escala }} aria-hidden="true" />
      {PRIMEROS_DIAS.map((d, i) => (
        <motion.li
          key={d.cuando}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.6, delay: 0.05 * i }}
          className="relative"
        >
          <span className="absolute -left-12 top-0 grid size-10 place-items-center rounded-full border-4 border-bg bg-accent font-bold text-white shadow-marca md:-left-16 md:size-14 md:text-lg">
            {i + 1}
          </span>
          <p className="t-eyebrow !text-sm">{d.cuando}</p>
          <h3 className="t-h3 mt-1">{d.titulo}</h3>
          <p className="mt-2 text-lg text-ink-2">{d.texto}</p>
        </motion.li>
      ))}
    </ol>
  );
}

export function ResumenNumeros() {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {[
        { v: 15, s: " años", t: "de compromiso" },
        { v: 48, s: " h", t: "respuesta del refugio" },
        { v: 0, p: "$ ", t: "cuesta adoptar" },
      ].map((x) => (
        <div key={x.t} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-2xl font-bold md:text-4xl">
            <Contador valor={x.v} sufijo={x.s} prefijo={x.p} />
          </p>
          <p className="text-sm text-white/80">{x.t}</p>
        </div>
      ))}
    </div>
  );
}
