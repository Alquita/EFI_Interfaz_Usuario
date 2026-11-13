"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { TextoRevelado } from "./Movimiento";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

/** Cabecera de página con foto, parallax, migas de pan y título animado */
export function Cabecera({
  foto,
  alt = "",
  antetitulo,
  titulo,
  resaltar,
  bajada,
  migas = [],
  foco = "50% 50%",
  children,
}: {
  foto: string;
  alt?: string;
  antetitulo: string;
  titulo: string;
  resaltar?: string[];
  bajada?: ReactNode;
  migas?: { href?: string; texto: string }[];
  foco?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducido = useMovimientoReducido();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reducido ? "0%" : "25%"]);
  const escala = useTransform(scrollYProgress, [0, 1], [1, reducido ? 1 : 1.08]);
  const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} className="cabecera">
      <motion.div className="absolute inset-0 -z-20" style={{ y, scale: escala }}>
        <Image src={foto} alt={alt} fill sizes="100vw" loading="eager" fetchPriority="high" className="ken-burns object-cover" style={{ objectPosition: foco }} />
      </motion.div>
      <div className="cabecera-velo" aria-hidden="true" />
      <motion.div className="contenedor" style={{ opacity: opacidad }}>
        <nav aria-label="Migas de pan">
          <motion.ol className="migas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            {migas.map((m) => (
              <li key={m.texto} className="flex items-center gap-1.5">
                <ChevronRight className="size-4 opacity-70" aria-hidden="true" />
                {m.href ? <Link href={m.href}>{m.texto}</Link> : <span aria-current="page">{m.texto}</span>}
              </li>
            ))}
          </motion.ol>
        </nav>
        <motion.p
          className="t-eyebrow mt-6 !text-[#fdba74]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {antetitulo}
        </motion.p>
        <h1 className="t-h1 sobre-oscuro mt-3 max-w-4xl">
          <TextoRevelado texto={titulo} resaltar={resaltar} alCargar retraso={0.2} />
        </h1>
        {bajada && (
          <motion.p
            className="mt-5 max-w-2xl text-lg leading-8 text-white/85"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {bajada}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }} className="mt-8">
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
