import { CircleCheck, CircleX, Clock, Info, PawPrint } from "lucide-react";
import type { Notificacion } from "@/types";
import { cn } from "@/lib/utils";

const ICONO = { check: CircleCheck, paw: PawPrint, clock: Clock, x: CircleX, info: Info };

const COLOR: Record<Notificacion["tipo"], string> = {
  success: "bg-success-bg text-success",
  brand: "bg-accent-soft text-brand",
  review: "bg-review-bg text-review",
  error: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

export function IconoNotificacion({ n, className }: { n: Pick<Notificacion, "icono" | "tipo">; className?: string }) {
  const Icono = ICONO[n.icono];
  return (
    <span className={cn("n-icono grid size-11 shrink-0 place-items-center rounded-full", COLOR[n.tipo], className)}>
      <Icono className="size-5" aria-hidden="true" />
    </span>
  );
}
