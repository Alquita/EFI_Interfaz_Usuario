"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Cat, Dog, Pause, PawPrint, Play, Search, Sparkles } from "lucide-react";
import { MASCOTAS } from "@/data/mascotas";
import { cn } from "@/lib/utils";
import { TextoRevelado } from "@/components/ui/Movimiento";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

const DURACION = 7000;

const SLIDES = [
  {
    foto: "/img/hero/hero-1.jpg",
    alt: "Un corgi y un perrito de pelo largo corren felices por un camino de tierra al atardecer",
    corto: "Encontrá",
    titulo: "Tu próximo mejor amigo está a pocas cuadras.",
    resaltar: ["mejor", "amigo"],
    lead: "Perros y gatos de refugios y rescatistas de Río Cuarto, con ficha completa de salud, carácter y convivencia.",
    mascota: "toto",
    foco: "50% 60%",
  },
  {
    foto: "/img/hero/hero-2.jpg",
    alt: "Un gato atigrado y un perro blanco duermen abrazados sobre el pasto",
    corto: "Convivencia",
    titulo: "Sabé con quién se lleva bien antes de decidir.",
    resaltar: ["bien"],
    lead: "Cada ficha te dice si convive con perros, gatos y chicos. Sin sorpresas: información clara desde el primer día.",
    mascota: "tigre",
    foco: "50% 50%",
  },
  {
    foto: "/img/hero/hero-3.jpg",
    alt: "Un hombre abraza a un perro golden sonriente con montañas de fondo",
    corto: "Adoptar",
    titulo: "Adoptar es un abrazo que dura años.",
    resaltar: ["abrazo"],
    lead: "Solicitud guiada en 3 pasos y seguimiento del estado desde la app. Nada de mensajes perdidos.",
    mascota: "bruno",
    foco: "40% 40%",
  },
  {
    foto: "/img/hero/hero-4.jpg",
    alt: "Una pareja sonríe asomada a una ventana junto a su perro blanco y negro",
    corto: "Historias",
    titulo: "Más de 120 familias ya encontraron compañero.",
    resaltar: ["120", "familias"],
    lead: "Sumate a las historias que empezaron en AdoptApp y acompañá a los refugios de tu ciudad.",
    mascota: "lola",
    foco: "50% 35%",
  },
];

export function Hero() {
  const [{ actual, previo }, setSlide] = useState({ actual: 0, previo: -1 });
  const [pausaUsuario, setPausaUsuario] = useState(false);
  const [pausaFoco, setPausaFoco] = useState(false);
  const [especie, setEspecie] = useState<"" | "perro" | "gato">("");
  const reducido = useMovimientoReducido();
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yFotos = useTransform(scrollYProgress, [0, 1], ["0%", reducido ? "0%" : "22%"]);
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, reducido ? 0 : -120]);
  const opacidad = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const pausado = pausaUsuario || pausaFoco || reducido;
  const slide = SLIDES[actual];
  const mascota = MASCOTAS.find((m) => m.id === slide.mascota)!;

  const ir = (i: number) => {
    const n = (i + SLIDES.length) % SLIDES.length;
    setSlide((s) => (n === s.actual ? s : { actual: n, previo: s.actual }));
  };

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const p = new URLSearchParams();
    if (especie) p.set("especie", especie);
    const tamano = String(datos.get("tamano") || "");
    const etapa = String(datos.get("etapa") || "");
    if (tamano) p.set("tamano", tamano);
    if (etapa) p.set("etapa", etapa);
    router.push(`/?${p.toString()}#mascotas`, { scroll: false });
    requestAnimationFrame(() =>
      document.getElementById("mascotas")?.scrollIntoView({ behavior: reducido ? "auto" : "smooth" }),
    );
  };

  const alTeclado = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("input, select, textarea")) return;
    if (e.key === "ArrowRight") ir(actual + 1);
    if (e.key === "ArrowLeft") ir(actual - 1);
  };

  return (
    <section
      ref={ref}
      className="hero"
      aria-roledescription="carrusel"
      aria-label="Presentación de AdoptApp"
      onKeyDown={alTeclado}
      onFocus={(e) => {
        if ((e.target as HTMLElement).closest("[data-pausa-foco]")) setPausaFoco(true);
      }}
      onBlur={() => setPausaFoco(false)}
    >
      {/* Fotos con Ken Burns y parallax */}
      <motion.div className="absolute inset-0 -z-0" style={{ y: yFotos }} aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.foto} className="hero-slide overflow-hidden" data-activo={i === actual}>
            <Image
              src={s.foto}
              alt=""
              fill
              sizes="100vw"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              className={cn((i === actual || i === previo) && "ken-burns")}
              style={{ objectPosition: s.foco }}
            />
          </div>
        ))}
      </motion.div>
      <div className="hero-velo" aria-hidden="true" />
      <div className="hero-grano" aria-hidden="true" />

      <div className="contenedor relative z-10 flex min-h-[inherit] flex-col pb-8 pt-[calc(var(--header-h)+3.5rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <motion.div style={{ y: yTexto, opacity: opacidad }} className="my-auto max-w-[52rem]">
          <motion.p
            className="pastilla vidrio"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="punto-vivo ml-1.5" aria-hidden="true" />
            {MASCOTAS.filter((m) => m.estado === "disponible").length} perros y gatos buscan hogar hoy en Río Cuarto
          </motion.p>

          <h1 className="t-display sobre-oscuro mt-6 min-h-[2.2em] text-balance md:min-h-[2.2em]" aria-live="off">
            <AnimatePresence mode="wait" initial={true}>
              <motion.span
                key={actual}
                className="block"
                exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
              >
                <TextoRevelado texto={slide.titulo} resaltar={slide.resaltar} alCargar retraso={0.1} paso={0.055} />
              </motion.span>
            </AnimatePresence>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={actual}
              className="mt-5 max-w-[38rem] text-lg leading-8 text-white/85 md:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6 } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            >
              {slide.lead}
            </motion.p>
          </AnimatePresence>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/#mascotas" className="btn btn-primario btn-lg">
              <PawPrint className="size-5" aria-hidden="true" />
              Ver mascotas
            </Link>
            <Link href="/descubrir" className="btn btn-vidrio btn-lg">
              <Sparkles className="size-5" aria-hidden="true" />
              Descubrir mi match
            </Link>
          </motion.div>
        </motion.div>

        {/* Buscador + mascota destacada */}
        <div className="mt-12 grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" data-pausa-foco>
          <motion.form
            onSubmit={buscar}
            role="search"
            aria-label="Buscar mascotas"
            className="vidrio-oscuro grid gap-3 rounded-[1.75rem] p-3 md:grid-cols-[auto_minmax(8rem,1fr)_minmax(8rem,1fr)_auto] md:items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="segmentado" role="group" aria-label="Especie">
              {(
                [
                  { v: "", t: "Todos", i: PawPrint },
                  { v: "perro", t: "Perros", i: Dog },
                  { v: "gato", t: "Gatos", i: Cat },
                ] as const
              ).map((o) => (
                <button key={o.v} type="button" aria-pressed={especie === o.v} onClick={() => setEspecie(o.v)} className="px-4">
                  {especie === o.v && (
                    <motion.span layoutId="hero-especie" className="segmento-fondo" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <o.i className="size-4" aria-hidden="true" />
                  {o.t}
                </button>
              ))}
            </div>
            <label className="sr-only" htmlFor="hero-tamano">
              Tamaño
            </label>
            <select id="hero-tamano" name="tamano" className="select-vidrio" defaultValue="">
              <option value="">Tamaño</option>
              <option value="pequeno">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
            <label className="sr-only" htmlFor="hero-etapa">
              Edad
            </label>
            <select id="hero-etapa" name="etapa" className="select-vidrio" defaultValue="">
              <option value="">Edad</option>
              <option value="cachorro">Cachorro</option>
              <option value="joven">Joven</option>
              <option value="adulto">Adulto</option>
              <option value="mayor">Senior</option>
            </select>
            <button type="submit" className="btn btn-primario btn-lg">
              <Search className="size-5" aria-hidden="true" />
              Buscar
            </button>
          </motion.form>

          <AnimatePresence mode="wait">
            <motion.div
              key={mascota.id}
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1, transition: { delay: 0.3, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
              className="hidden lg:block"
            >
              <Link
                href={`/mascota/${mascota.id}`}
                className="vidrio group flex items-center gap-4 rounded-[1.75rem] p-3 pr-5 text-white transition-colors hover:bg-white/20"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={mascota.foto} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#fdba74]">Conocé a</span>
                  <span className="block text-lg font-bold leading-6">{mascota.nombre}</span>
                  <span className="block truncate text-sm text-white/80">
                    {mascota.edad} · {mascota.barrio}
                  </span>
                </span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores con progreso + controles */}
        <div className="mt-8 flex items-end gap-4" data-pausa-foco>
          <div className="grid flex-1 grid-cols-4 gap-3 md:gap-5">
            {SLIDES.map((s, i) => (
              <button
                key={s.foto}
                type="button"
                className={cn("hero-indicador", i < actual && "visto")}
                aria-current={i === actual}
                aria-label={`Diapositiva ${i + 1} de ${SLIDES.length}: ${s.corto}`}
                onClick={() => ir(i)}
              >
                <span className="hidden items-baseline gap-2 text-sm font-semibold md:flex">
                  <span className="tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                  {s.corto}
                </span>
                <span className="pista">
                  {i === actual &&
                    (reducido ? (
                      <span style={{ transform: "scaleX(1)" }} />
                    ) : (
                      <span
                        key={`${actual}-${previo}`}
                        className="barra-llenando"
                        data-pausado={pausado}
                        style={{ ["--duracion" as string]: `${DURACION}ms` }}
                        onAnimationEnd={() => ir(actual + 1)}
                      />
                    ))}
                </span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            {!reducido && (
              <button
                type="button"
                className="icon-btn icon-btn-vidrio"
                onClick={() => setPausaUsuario((p) => !p)}
                aria-label={pausaUsuario ? "Reanudar presentación" : "Pausar presentación"}
              >
                {pausaUsuario ? <Play className="size-5" /> : <Pause className="size-5" />}
              </button>
            )}
            <button type="button" className="icon-btn icon-btn-vidrio hidden sm:inline-grid" onClick={() => ir(actual - 1)} aria-label="Diapositiva anterior">
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" className="icon-btn icon-btn-vidrio hidden sm:inline-grid" onClick={() => ir(actual + 1)} aria-label="Diapositiva siguiente">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {pausado ? `Diapositiva ${actual + 1} de ${SLIDES.length}: ${slide.titulo}` : ""}
        </p>
      </div>
    </section>
  );
}
