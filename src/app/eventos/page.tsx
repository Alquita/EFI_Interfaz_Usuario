import type { Metadata } from "next";
import { Cabecera } from "@/components/ui/Cabecera";
import { Eventos } from "@/components/comunidad/Eventos";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Ferias de adopción, castraciones gratuitas, vacunación y charlas en Río Cuarto.",
};

export default function PaginaEventos() {
  return (
    <>
      <Cabecera
        foto="/img/banners/eventos.jpg"
        antetitulo="Agenda de la comunidad"
        titulo="Ferias, castraciones y charlas."
        resaltar={["castraciones"]}
        bajada="Activá recordatorios o agregalos a tu calendario con un toque."
        migas={[{ texto: "Eventos" }]}
      />
      <section className="contenedor py-14 lg:py-20" aria-label="Próximos eventos">
        <Eventos />
      </section>
    </>
  );
}
