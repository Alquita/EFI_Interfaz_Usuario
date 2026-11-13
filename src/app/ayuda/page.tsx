import type { Metadata } from "next";
import { Cabecera } from "@/components/ui/Cabecera";
import { Ayuda } from "@/components/comunidad/Ayuda";

export const metadata: Metadata = { title: "Preguntas frecuentes", description: "Respuestas sobre adopción, publicaciones, cuenta, refugios y accesibilidad." };

export default function PaginaAyuda() {
  return (
    <>
      <Cabecera
        foto="/img/banners/ayuda.jpg"
        antetitulo="Centro de ayuda"
        titulo="¿En qué te podemos ayudar?"
        resaltar={["ayudar?"]}
        bajada="Buscá por palabra o elegí una categoría."
        migas={[{ texto: "Ayuda" }]}
      />
      <section className="contenedor py-14 lg:py-20" aria-label="Preguntas frecuentes">
        <Ayuda />
      </section>
    </>
  );
}
