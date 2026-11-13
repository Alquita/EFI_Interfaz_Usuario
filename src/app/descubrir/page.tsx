import type { Metadata } from "next";
import { Cabecera } from "@/components/ui/Cabecera";
import { Mazo } from "@/components/descubrir/Mazo";

export const metadata: Metadata = {
  title: "Descubrir",
  description: "Conocé a las mascotas en adopción de a una: deslizá a la derecha si te gusta y guardala en favoritos.",
};

export default function Descubrir() {
  return (
    <>
      <Cabecera
        foto="/img/banners/descubrir.jpg"
        antetitulo="Descubrir · solo en AdoptApp"
        titulo="Deslizá y encontrá tu match."
        resaltar={["match."]}
        bajada="A la derecha si te gusta, a la izquierda para seguir. Las que elegís quedan en favoritos para comparar con calma."
        migas={[{ texto: "Descubrir" }]}
        foco="50% 40%"
      />
      <section className="contenedor py-14 lg:py-20" aria-label="Mazo de mascotas">
        <Mazo />
      </section>
    </>
  );
}
