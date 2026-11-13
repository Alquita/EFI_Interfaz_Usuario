import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Favoritos } from "@/components/mascotas/Favoritos";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata: Metadata = { title: "Favoritos" };

export default function PaginaFavoritos() {
  return (
    <div className="contenedor pb-10">
      <TituloPagina
        antetitulo="Tu lista"
        titulo="Favoritos"
        bajada="Las mascotas que guardaste para pensarlo con calma. Compará hasta tres lado a lado."
        acciones={
          <Link href="/descubrir" className="btn btn-secundario">
            <Sparkles className="size-5" aria-hidden="true" /> Descubrir más
          </Link>
        }
      />
      <Favoritos />
    </div>
  );
}
