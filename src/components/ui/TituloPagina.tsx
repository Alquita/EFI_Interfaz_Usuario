import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Aparecer, TextoRevelado } from "./Movimiento";

/** Encabezado simple para páginas de cuenta (sin foto) */
export function TituloPagina({
  antetitulo,
  titulo,
  bajada,
  acciones,
  className,
}: {
  antetitulo?: string;
  titulo: string;
  bajada?: ReactNode;
  acciones?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative mb-10 flex flex-col gap-5 pt-8 md:flex-row md:items-end md:justify-between lg:pt-12", className)}>
      <div>
        {antetitulo && <p className="t-eyebrow">{antetitulo}</p>}
        <h1 className="t-h1 mt-2">
          <TextoRevelado texto={titulo} alCargar />
        </h1>
        {bajada && (
          <Aparecer retraso={0.2}>
            <p className="t-lead mt-3 max-w-2xl">{bajada}</p>
          </Aparecer>
        )}
      </div>
      {acciones && <Aparecer retraso={0.25} className="flex flex-wrap gap-2">{acciones}</Aparecer>}
    </header>
  );
}
