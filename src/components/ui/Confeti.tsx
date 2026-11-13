"use client";

import { motion } from "motion/react";
import { Huella } from "./Marca";

/* Posiciones pseudoaleatorias deterministas (el render tiene que ser puro) */
const PIEZAS = Array.from({ length: 26 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const r = a - Math.floor(a);
  const b = Math.sin(i * 78.233) * 12345.6789;
  const r2 = b - Math.floor(b);
  return {
    x: (r - 0.5) * 900,
    y: -180 - r2 * 320,
    rot: (r - 0.5) * 540,
    escala: 0.5 + r2 * 0.9,
    color: ["#f97316", "#c2410c", "#fdba74", "#15803d", "#fcd34d"][i % 5],
    retraso: r2 * 0.25,
    huella: i % 3 !== 0,
  };
});

/** Lluvia de huellitas y papelitos para celebrar (solicitud enviada, match, etc.) */
export function Confeti() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/3 z-[80] flex justify-center" aria-hidden="true">
      {PIEZAS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ color: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 700],
            opacity: [1, 1, 0],
            rotate: p.rot,
            scale: p.escala,
          }}
          transition={{ duration: 2.4, delay: p.retraso, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 1] }}
        >
          {p.huella ? <Huella className="size-7" /> : <span className="block h-3 w-2 rounded-sm" style={{ background: p.color }} />}
        </motion.span>
      ))}
    </div>
  );
}
