import { Suspense } from "react";
import { Hero } from "@/components/inicio/Hero";
import { Catalogo, CatalogoCargando } from "@/components/inicio/Catalogo";
import {
  ComoFunciona,
  Comunidad,
  CtaFinal,
  DescubrirPromo,
  EventosInicio,
  HistoriasInicio,
  Impacto,
  RecienLlegados,
  TestPromo,
} from "@/components/inicio/Secciones";
import { PreguntasInicio, RefugiosCercanos } from "@/components/inicio/SeccionesCliente";
import { EncabezadoSeccion } from "@/components/ui/Bloques";

export default function Inicio() {
  return (
    <>
      <Hero />
      <Impacto />
      <RecienLlegados />

      <section id="mascotas" className="seccion scroll-mt seccion-crema" aria-labelledby="t-mascotas">
        <div className="contenedor">
          <EncabezadoSeccion
            id="t-mascotas"
            antetitulo="En adopción"
            titulo="Encontrá a tu compañero."
            resaltar={["compañero."]}
            bajada="Filtrá por especie, tamaño, edad y refugio. Todas las fichas tienen salud, carácter y convivencia."
          />
          <Suspense fallback={<CatalogoCargando />}>
            <Catalogo />
          </Suspense>
        </div>
      </section>

      <ComoFunciona />
      <DescubrirPromo />
      <TestPromo />
      <RefugiosCercanos />
      <HistoriasInicio />
      <EventosInicio />
      <Comunidad />
      <PreguntasInicio />
      <CtaFinal />
    </>
  );
}
