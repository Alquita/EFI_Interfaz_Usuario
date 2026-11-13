import type { Metadata } from "next";
import { Solicitudes } from "@/components/cuenta/Solicitudes";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata: Metadata = { title: "Mis solicitudes" };

export default function MisSolicitudes() {
  return (
    <div className="contenedor pb-10">
      <TituloPagina
        antetitulo="Seguimiento"
        titulo="Mis solicitudes"
        bajada="El estado de cada solicitud, con color, ícono y texto. Te avisamos cuando el refugio responde."
      />
      <Solicitudes />
    </div>
  );
}
