"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Baby, Cat, Dog, Heart, Info, MapPin, PartyPopper, RotateCcw, Undo2, X } from "lucide-react";
import type { Mascota } from "@/types";
import { MASCOTAS } from "@/data/mascotas";
import { REFUGIOS } from "@/data/refugios";
import { acciones, useEstado } from "@/lib/store";
import { cn, compatibilidad } from "@/lib/utils";
import { Confeti } from "@/components/ui/Confeti";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

type Decision = 1 | -1;

function Carta({
  m,
  profundidad,
  onDecidir,
  compat,
}: {
  m: Mascota;
  profundidad: number;
  onDecidir: (d: Decision) => void;
  compat: number | null;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 320], [-16, 16]);
  const siOp = useTransform(x, [30, 130], [0, 1]);
  const noOp = useTransform(x, [-130, -30], [1, 0]);
  const tope = profundidad === 0;

  const alSoltar = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120 || info.velocity.x > 650) onDecidir(1);
    else if (info.offset.x < -120 || info.velocity.x < -650) onDecidir(-1);
  };

  return (
    <motion.article
      className="pila-tarjeta"
      style={{ x: tope ? x : 0, rotate: tope ? rotate : 0, zIndex: 10 - profundidad }}
      initial={{ scale: 0.9, y: 40, opacity: 0 }}
      animate={{ scale: 1 - profundidad * 0.05, y: profundidad * 16, opacity: profundidad > 2 ? 0 : 1 }}
      exit="salir"
      variants={{
        salir: (d: Decision) => ({ x: d * 640, rotate: d * 28, opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] } }),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={tope ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={alSoltar}
      whileDrag={{ cursor: "grabbing", scale: 1.02 }}
      aria-hidden={!tope}
      aria-label={tope ? `${m.nombre}, ${m.tipo.toLowerCase()} de ${m.edad}` : undefined}
    >
      <Image src={m.foto} alt={tope ? m.alt : ""} fill sizes="(min-width:1024px) 28rem, 92vw" loading={profundidad < 2 ? "eager" : "lazy"} draggable={false} />
      {tope && (
        <>
          <motion.span className="sello left-6 -rotate-12 text-[#4ade80]" style={{ opacity: siOp }} aria-hidden="true">
            Me gusta
          </motion.span>
          <motion.span className="sello right-6 rotate-12 text-[#f87171]" style={{ opacity: noOp }} aria-hidden="true">
            Paso
          </motion.span>
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/90 via-black/55 to-transparent p-6 pt-28 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[2rem] font-bold leading-9 tracking-tight">
              {m.nombre}, <span className="font-medium">{m.edad}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-white/85">
              <MapPin className="size-4" aria-hidden="true" /> {m.barrio} · {REFUGIOS[m.refugio].nombre}
            </p>
          </div>
          {compat !== null && (
            <span className="anillo !size-16 shrink-0" style={{ ["--p" as string]: compat }}>
              <span className="!bg-black/60 text-sm text-white backdrop-blur">{compat}%</span>
            </span>
          )}
        </div>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {m.rasgos.map((r) => (
            <li key={r} className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
              {r}
            </li>
          ))}
          {m.convive.chicos && (
            <li className="flex items-center gap-1 rounded-full bg-[#15803d]/80 px-3 py-1 text-sm font-semibold">
              <Baby className="size-4" aria-hidden="true" /> Chicos
            </li>
          )}
          {m.convive.gatos && m.especie === "perro" && (
            <li className="flex items-center gap-1 rounded-full bg-[#15803d]/80 px-3 py-1 text-sm font-semibold">
              <Cat className="size-4" aria-hidden="true" /> Gatos
            </li>
          )}
          {m.convive.perros && m.especie === "gato" && (
            <li className="flex items-center gap-1 rounded-full bg-[#15803d]/80 px-3 py-1 text-sm font-semibold">
              <Dog className="size-4" aria-hidden="true" /> Perros
            </li>
          )}
        </ul>
      </div>
    </motion.article>
  );
}

export function Mazo() {
  const { favoritos, descartados, test } = useEstado();
  const [especie, setEspecie] = useState<"" | "perro" | "gato">("");
  const [salida, setSalida] = useState<Decision>(1);
  const [historial, setHistorial] = useState<{ id: string; d: Decision }[]>([]);
  const [festejo, setFestejo] = useState(0);
  const reducido = useMovimientoReducido();
  const zona = useRef<HTMLDivElement>(null);

  const vistos = new Set([...favoritos, ...descartados]);
  const mazo = MASCOTAS.filter((m) => m.estado === "disponible" && !vistos.has(m.id) && (!especie || m.especie === especie));
  const tope = mazo[0];
  const total = MASCOTAS.filter((m) => m.estado === "disponible" && (!especie || m.especie === especie)).length;
  const matches = favoritos.map((id) => MASCOTAS.find((m) => m.id === id)).filter(Boolean) as Mascota[];

  const decidir = (d: Decision) => {
    if (!tope) return;
    setSalida(d);
    setHistorial((h) => [...h, { id: tope.id, d }]);
    if (d === 1) {
      acciones.alternarFavorito(tope.id);
      setFestejo((f) => f + 1);
      toast.success(`¡Match con ${tope.nombre}! Lo guardamos en favoritos`);
    } else {
      acciones.descartar(tope.id);
    }
  };

  const deshacer = () => {
    const ultimo = historial.at(-1);
    if (!ultimo) return;
    setHistorial((h) => h.slice(0, -1));
    if (ultimo.d === 1) acciones.alternarFavorito(ultimo.id);
    else acciones.deshacerDescarte(ultimo.id);
  };

  /* Teclado: ← paso, → me gusta, Retroceso deshace (si no se está escribiendo) */
  const alTecla = useEffectEvent((e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [role=dialog]")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      decidir(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      decidir(-1);
    } else if (e.key === "Backspace" || (e.key === "z" && (e.ctrlKey || e.metaKey))) {
      deshacer();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      {festejo > 0 && !reducido && <Confeti key={festejo} />}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="pestanas" role="group" aria-label="Qué querés ver">
            {(
              [
                { v: "", t: "Todos" },
                { v: "perro", t: "Perros" },
                { v: "gato", t: "Gatos" },
              ] as const
            ).map((o) => (
              <button key={o.v} type="button" className="pestana" aria-pressed={especie === o.v} onClick={() => setEspecie(o.v)}>
                {especie === o.v && <motion.span layoutId="desc-esp" className="pestana-fondo" />}
                <span className={cn(especie === o.v && "text-brand")}>{o.t}</span>
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-ink-2 tabular-nums" aria-live="polite">
            {mazo.length ? `Quedan ${mazo.length} de ${total}` : "Viste a todos"}
          </p>
        </div>

        <div ref={zona} className="relative aspect-[3/4.1] w-full" aria-live="polite">
          <AnimatePresence custom={salida} initial={false}>
            {mazo
              .slice(0, 3)
              .reverse()
              .map((m) => {
                const prof = mazo.indexOf(m);
                return (
                  <Carta
                    key={m.id}
                    m={m}
                    profundidad={prof}
                    onDecidir={decidir}
                    compat={test ? compatibilidad(m, test).puntos : null}
                  />
                );
              })}
          </AnimatePresence>
          {!tope && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 grid place-items-center rounded-[2rem] border-2 border-dashed border-line bg-cream p-8 text-center"
            >
              <div>
                <span className="vacio-icono mx-auto">
                  <PartyPopper className="size-10" aria-hidden="true" />
                </span>
                <h2 className="t-h3 mt-2">¡Viste a todos!</h2>
                <p className="mt-2 text-ink-2">
                  Tenés {matches.length} {matches.length === 1 ? "match" : "matches"}. Mirá sus fichas con calma o empezá de nuevo.
                </p>
                <div className="mt-6 grid gap-2">
                  <Link href="/favoritos" className="btn btn-primario">
                    <Heart className="size-5" aria-hidden="true" /> Ver mis matches
                  </Link>
                  <button type="button" className="btn btn-neutro" onClick={() => acciones.reiniciarDescubrir()}>
                    <RotateCcw className="size-5" aria-hidden="true" /> Volver a ver los que pasé
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            className="grid size-12 place-items-center rounded-full border border-line bg-card text-ink-2 shadow-e1 transition-colors hover:text-ink disabled:opacity-40"
            onClick={deshacer}
            disabled={!historial.length}
            aria-label="Deshacer la última decisión"
          >
            <Undo2 className="size-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ y: -3 }}
            type="button"
            className="grid size-16 place-items-center rounded-full border border-line bg-card text-danger shadow-e2 disabled:opacity-40"
            onClick={() => decidir(-1)}
            disabled={!tope}
            aria-label={tope ? `Pasar a ${tope.nombre}` : "Pasar"}
          >
            <X className="size-8" strokeWidth={2.5} />
          </motion.button>
          <Link
            href={tope ? `/mascota/${tope.id}` : "#"}
            className="grid size-12 place-items-center rounded-full border border-line bg-card text-info shadow-e1"
            aria-label={tope ? `Ver la ficha de ${tope.nombre}` : "Ver ficha"}
            aria-disabled={!tope}
          >
            <Info className="size-5" />
          </Link>
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ y: -3 }}
            type="button"
            className="grid size-16 place-items-center rounded-full bg-accent text-white shadow-marca disabled:opacity-40"
            onClick={() => decidir(1)}
            disabled={!tope}
            aria-label={tope ? `Me gusta ${tope.nombre}` : "Me gusta"}
          >
            <Heart className="size-8 fill-current" />
          </motion.button>
        </div>
        <p className="mt-4 text-center text-sm text-ink-2">
          Atajos: <kbd className="kbd">←</kbd> paso · <kbd className="kbd">→</kbd> me gusta · <kbd className="kbd">⌫</kbd> deshacer
        </p>
      </div>

      <aside className="lg:pt-16" aria-labelledby="t-matches">
        <div className="tarjeta p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 id="t-matches" className="t-h4 flex items-center gap-2">
            <Heart className="size-5 fill-current text-brand" aria-hidden="true" /> Tus matches
            <span className="cuenta ml-auto grid min-w-7 place-items-center rounded-full bg-accent-soft px-2 text-sm font-bold text-brand">
              {matches.length}
            </span>
          </h2>
          {matches.length ? (
            <ul className="mt-4 grid gap-2">
              <AnimatePresence initial={false}>
                {matches.slice(0, 6).map((m) => (
                  <motion.li key={m.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <Link href={`/mascota/${m.id}`} className="fila-lista !min-h-0 rounded-xl !p-2">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                        <Image src={m.foto} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{m.nombre}</span>
                        <span className="sub truncate">
                          {m.edad} · {m.barrio}
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <p className="mt-3 text-ink-2">Todavía no hay. Deslizá a la derecha a quien te guste.</p>
          )}
          <Link href="/favoritos" className="btn btn-secundario btn-bloque mt-5">
            Comparar mis matches
          </Link>
          {!test && (
            <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-ink-2">
              <Link href="/guia#test" className="enlace">
                Hacé el test
              </Link>{" "}
              y te mostramos tu % de compatibilidad en cada tarjeta.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
