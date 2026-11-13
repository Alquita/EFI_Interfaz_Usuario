"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useState } from "react";
import { useMotionValueEvent } from "motion/react";

/** Botón "volver arriba" con anillo de progreso de lectura */
export function VolverArriba() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const trazo = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 900));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="volver-arriba"
          aria-label="Volver arriba"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.getElementById("contenido")?.focus({ preventScroll: true });
          }}
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
            <motion.circle cx="24" cy="24" r="21" fill="none" stroke="var(--brand-deco)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: trazo }} />
          </svg>
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
