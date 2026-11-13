"use client";

import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { acciones, useEstado } from "@/lib/store";
import { cn } from "@/lib/utils";

const PARTICULAS = Array.from({ length: 8 }, (_, i) => {
  const ang = (i / 8) * Math.PI * 2;
  return { x: Math.cos(ang) * 26, y: Math.sin(ang) * 26 };
});

export function BotonFavorito({
  id,
  nombre,
  className,
  grande = false,
}: {
  id: string;
  nombre: string;
  className?: string;
  grande?: boolean;
}) {
  const { favoritos } = useEstado();
  const router = useRouter();
  const activo = favoritos.includes(id);

  const alternar = () => {
    const ahora = acciones.alternarFavorito(id);
    if (ahora) {
      toast.success(`${nombre} se guardó en favoritos`, {
        action: { label: "Ver", onClick: () => router.push("/favoritos") },
      });
    } else {
      toast(`Quitaste a ${nombre} de favoritos`, {
        action: { label: "Deshacer", onClick: () => acciones.alternarFavorito(id) },
      });
    }
  };

  return (
    <button
      type="button"
      className={cn("btn-fav", grande && "size-12", className)}
      aria-pressed={activo}
      aria-label={activo ? `Quitar a ${nombre} de favoritos` : `Guardar a ${nombre} en favoritos`}
      onClick={alternar}
    >
      <motion.span
        key={activo ? "si" : "no"}
        initial={{ scale: activo ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart className={grande ? "size-6" : "size-5"} />
      </motion.span>
      <AnimatePresence initial={false}>
        {activo && (
          <motion.span key="estallido" className="pointer-events-none absolute inset-0" aria-hidden="true" exit={{ opacity: 0 }}>
            {PARTICULAS.map((p, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 size-1.5 -ml-[3px] -mt-[3px] rounded-full bg-brand-deco"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
