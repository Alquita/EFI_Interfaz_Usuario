import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { ListaRefugios } from "@/components/comunidad/Refugios";

export const metadata: Metadata = {
  title: "Mapa de refugios",
  description: "Refugios y rescatistas aliados de Río Cuarto: horarios, teléfonos, cómo llegar y qué necesitan.",
};

export default function PaginaRefugios() {
  return (
    <>
      <Cabecera
        foto="/img/banners/refugio.jpg"
        antetitulo="Mapa de refugios"
        titulo="Los refugios de tu ciudad, en un solo lugar."
        resaltar={["un", "solo", "lugar."]}
        bajada="Horarios, teléfonos, cómo llegar y qué necesitan esta semana."
        migas={[{ texto: "Refugios" }]}
      >
        <Link href="/sumar-refugio" className="btn btn-vidrio">
          <Store className="size-5" aria-hidden="true" /> Sumar mi refugio
        </Link>
      </Cabecera>
      <section className="contenedor py-14 lg:py-20" aria-label="Refugios aliados">
        <ListaRefugios />
      </section>
    </>
  );
}
