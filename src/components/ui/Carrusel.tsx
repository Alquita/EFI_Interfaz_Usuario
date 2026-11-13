"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

const EV_SELECCION: EmblaEventType[] = ["select", "reInit", "init"];
const EV_AUTOPLAY: EmblaEventType[] = ["autoplay:play", "autoplay:stop", "reInit", "init"];

/** Lee un valor de Embla como estado externo (sin setState dentro de efectos) */
function useValorEmbla<T>(
  api: EmblaCarouselType | undefined,
  eventos: EmblaEventType[],
  leer: (api: EmblaCarouselType) => T,
  inicial: T,
) {
  const suscribir = useCallback(
    (cb: () => void) => {
      if (!api) return () => {};
      eventos.forEach((e) => api.on(e, cb));
      return () => eventos.forEach((e) => api.off(e, cb));
    },
    [api, eventos],
  );
  return useSyncExternalStore(
    suscribir,
    () => (api ? leer(api) : inicial),
    () => inicial,
  );
}

export function Carrusel({
  children,
  etiqueta,
  claseSlide = "basis-[82%] sm:basis-1/2 lg:basis-1/3",
  autoplay = false,
  loop = false,
  demora = 5500,
  className,
  claro = false,
  alinear = "start",
}: {
  children: ReactNode;
  etiqueta: string;
  claseSlide?: string;
  autoplay?: boolean;
  loop?: boolean;
  demora?: number;
  className?: string;
  /** controles blancos para fondos oscuros */
  claro?: boolean;
  alinear?: "start" | "center";
}) {
  const reducido = useMovimientoReducido();
  const conAutoplay = autoplay && !reducido;
  const [refVista, api] = useEmblaCarousel(
    { align: alinear, loop, containScroll: loop ? false : "trimSnaps", skipSnaps: false, dragFree: false },
    conAutoplay
      ? [Autoplay({ delay: demora, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })]
      : [],
  );
  const id = useId();
  const barra = useRef<HTMLSpanElement>(null);
  const slides = Children.toArray(children);

  const seleccionado = useValorEmbla(api, EV_SELECCION, (a) => a.selectedScrollSnap(), 0);
  const total = useValorEmbla(api, EV_SELECCION, (a) => a.scrollSnapList().length, slides.length);
  const puedeAnterior = useValorEmbla(api, EV_SELECCION, (a) => a.canScrollPrev(), loop);
  const puedeSiguiente = useValorEmbla(api, EV_SELECCION, (a) => a.canScrollNext(), true);
  const reproduciendo = useValorEmbla(
    api,
    EV_AUTOPLAY,
    (a) => Boolean(a.plugins().autoplay?.isPlaying()),
    conAutoplay,
  );

  /* Barra de progreso del desplazamiento (se pinta directo, sin re-render) */
  useEffect(() => {
    if (!api) return;
    const pintar = () => {
      const p = Math.max(0, Math.min(1, api.scrollProgress()));
      if (barra.current) barra.current.style.transform = `scaleX(${loop ? (api.selectedScrollSnap() + 1) / api.scrollSnapList().length : Math.max(0.08, p)})`;
    };
    pintar();
    api.on("scroll", pintar).on("reInit", pintar).on("select", pintar);
    return () => {
      api.off("scroll", pintar).off("reInit", pintar).off("select", pintar);
    };
  }, [api, loop]);

  const alTeclado = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      api?.scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      api?.scrollNext();
    }
  };

  const alternarAutoplay = () => {
    const ap = api?.plugins().autoplay;
    if (!ap) return;
    if (ap.isPlaying()) ap.stop();
    else ap.play();
  };

  const boton = claro ? "icon-btn icon-btn-vidrio" : "icon-btn icon-btn-borde";

  return (
    <section
      className={cn("carrusel", className)}
      aria-roledescription="carrusel"
      aria-label={etiqueta}
    >
      <div
        ref={refVista}
        className="carrusel-vista"
        tabIndex={0}
        onKeyDown={alTeclado}
        aria-describedby={`${id}-ayuda`}
      >
        <div className="carrusel-pista" aria-live={reproduciendo ? "off" : "polite"}>
          {slides.map((s, i) => (
            <div
              key={i}
              className={cn("carrusel-slide", claseSlide)}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      <p id={`${id}-ayuda`} className="sr-only">
        Usá las flechas izquierda y derecha para moverte entre las tarjetas.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className={cn("carrusel-progreso", claro && "claro")} aria-hidden="true">
          <span ref={barra} />
        </div>
        <span className={cn("min-w-[3.5rem] text-right text-sm font-semibold tabular-nums", claro ? "text-white/80" : "text-ink-2")}>
          {String(seleccionado + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {conAutoplay && (
          <button
            type="button"
            className={boton}
            onClick={alternarAutoplay}
            aria-label={reproduciendo ? "Pausar el carrusel" : "Reanudar el carrusel"}
          >
            {reproduciendo ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
        )}
        <button
          type="button"
          className={boton}
          onClick={() => api?.scrollPrev()}
          disabled={!puedeAnterior}
          aria-label="Anterior"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          className={boton}
          onClick={() => api?.scrollNext()}
          disabled={!puedeSiguiente}
          aria-label="Siguiente"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
