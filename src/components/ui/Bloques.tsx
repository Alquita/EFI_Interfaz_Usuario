import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Aparecer, TextoRevelado } from "./Movimiento";

/** Encabezado de sección: antetítulo, título animado, bajada y acción opcional */
export function EncabezadoSeccion({
  antetitulo,
  titulo,
  resaltar,
  bajada,
  accion,
  centrado = false,
  claro = false,
  className,
  id,
}: {
  antetitulo?: string;
  titulo: string;
  resaltar?: string[];
  bajada?: ReactNode;
  accion?: { href: string; texto: string };
  centrado?: boolean;
  claro?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14",
        centrado ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", centrado && "mx-auto")}>
        {antetitulo && (
          <Aparecer>
            <p className={cn("t-eyebrow flex items-center gap-2", centrado && "justify-center", claro && "!text-[#fdba74]")}>
              <span className={cn("h-0.5 w-6 rounded-full bg-current")} aria-hidden="true" />
              {antetitulo}
            </p>
          </Aparecer>
        )}
        <h2 id={id} className={cn("t-h2 mt-3", claro && "sobre-oscuro text-white")}>
          <TextoRevelado texto={titulo} resaltar={resaltar} />
        </h2>
        {bajada && (
          <Aparecer retraso={0.15}>
            <p className={cn("t-lead mt-4", claro && "!text-white/80")}>{bajada}</p>
          </Aparecer>
        )}
      </div>
      {accion && (
        <Aparecer retraso={0.2} className="shrink-0">
          <Link href={accion.href} className={cn("btn group", claro ? "btn-vidrio" : "btn-secundario")}>
            {accion.texto}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Aparecer>
      )}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("tarjeta p-6 md:p-8", className)}>{children}</div>;
}
