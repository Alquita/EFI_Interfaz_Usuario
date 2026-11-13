import type { Metadata } from "next";
import { Ajustes } from "@/components/cuenta/Ajustes";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata: Metadata = { title: "Ajustes" };

export default function PaginaAjustes() {
  return (
    <div className="contenedor pb-10">
      <TituloPagina
        className="mx-auto max-w-3xl"
        antetitulo="Tu cuenta"
        titulo="Ajustes"
        bajada="Elegí cómo se ve AdoptApp y cómo te avisamos. Se guarda en este dispositivo."
      />
      <Ajustes />
    </div>
  );
}
