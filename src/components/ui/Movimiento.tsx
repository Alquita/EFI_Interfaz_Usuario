"use client";

/* Primitivas de animación: aparecer al hacer scroll, escalonado, contador,
   texto que se revela palabra por palabra y parallax. Todas respetan
   "reducir movimiento" vía <MotionConfig reducedMotion> en Proveedores. */
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, miles } from "@/lib/utils";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

const EASE = [0.2, 0.8, 0.2, 1] as const;

type Direccion = "arriba" | "izquierda" | "derecha" | "escala" | "ninguna";

const DESDE: Record<Direccion, Record<string, number>> = {
  arriba: { y: 28 },
  izquierda: { x: -36 },
  derecha: { x: 36 },
  escala: { scale: 0.94 },
  ninguna: {},
};

export function Aparecer({
  children,
  className,
  desde = "arriba",
  retraso = 0,
  como = "div",
}: {
  children: ReactNode;
  className?: string;
  desde?: Direccion;
  retraso?: number;
  como?: "div" | "section" | "li" | "article" | "header";
}) {
  const M = motion[como];
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...DESDE[desde] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: retraso }}
    >
      {children}
    </M>
  );
}

const contenedor: Variants = {
  oculto: {},
  visible: (paso: number = 0.08) => ({ transition: { staggerChildren: paso } }),
};

export const itemEscalonado: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function Escalonado({
  children,
  className,
  paso = 0.08,
  como = "div",
}: {
  children: ReactNode;
  className?: string;
  paso?: number;
  como?: "div" | "ul" | "ol";
}) {
  const M = motion[como];
  return (
    <M
      className={className}
      variants={contenedor}
      custom={paso}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </M>
  );
}

export function ItemEscalonado({
  children,
  className,
  como = "div",
}: {
  children: ReactNode;
  className?: string;
  como?: "div" | "li" | "article";
}) {
  const M = motion[como];
  return (
    <M className={className} variants={itemEscalonado}>
      {children}
    </M>
  );
}

/** Número que cuenta hacia arriba cuando entra en pantalla */
export function Contador({
  valor,
  prefijo = "",
  sufijo = "",
  duracion = 1.8,
  className,
}: {
  valor: number;
  prefijo?: string;
  sufijo?: string;
  duracion?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reducido = useMovimientoReducido();
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!visible) return;
    const nodo = ref.current;
    const pintar = (v: number) => {
      if (nodo) nodo.textContent = prefijo + miles(v) + sufijo;
    };
    if (reducido) {
      pintar(valor);
      return;
    }
    const ctrl = animate(mv, valor, { duration: duracion, ease: [0.16, 1, 0.3, 1], onUpdate: pintar });
    return () => ctrl.stop();
  }, [visible, valor, prefijo, sufijo, duracion, reducido, mv]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={`${prefijo}${miles(valor)}${sufijo}`}>
      {prefijo}
      {miles(valor)}
      {sufijo}
    </span>
  );
}

/** Título que se revela palabra por palabra desde abajo (máscara por línea) */
export function TextoRevelado({
  texto,
  className,
  retraso = 0,
  paso = 0.06,
  alCargar = false,
  resaltar = [],
}: {
  texto: string;
  className?: string;
  retraso?: number;
  paso?: number;
  /** true: anima al montar (hero). false: al entrar en pantalla */
  alCargar?: boolean;
  /** palabras que se pintan con el color de marca y subrayado a mano */
  resaltar?: string[];
}) {
  const palabras = texto.split(" ");
  const disparo = alCargar
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <motion.span
      className={cn("inline", className)}
      initial="oculto"
      {...disparo}
      transition={{ staggerChildren: paso, delayChildren: retraso }}
    >
      <span className="sr-only">{texto}</span>
      {palabras.map((p, i) => {
        const limpio = p.replace(/[.,!?¿¡:;]/g, "");
        const marcada = resaltar.includes(limpio);
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden="true">
            <motion.span
              className={cn("inline-block", marcada && "palabra-marcada")}
              variants={{
                oculto: { y: "110%", rotate: 4 },
                visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {p}
            </motion.span>
            {i < palabras.length - 1 ? " " : null}
          </span>
        );
      })}
    </motion.span>
  );
}

/** Imagen o bloque con parallax suave al hacer scroll */
export function Parallax({
  children,
  className,
  distancia = 80,
}: {
  children: ReactNode;
  className?: string;
  distancia?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reducido ? [0, 0] : [-distancia / 2, distancia / 2]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[60px] inset-x-0">
        {children}
      </motion.div>
    </div>
  );
}
