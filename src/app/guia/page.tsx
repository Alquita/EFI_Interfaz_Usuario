import type { Metadata } from "next";
import { Calculadora, Checklist, NavGuia, PrepararCasa, PrimerosDias, ResumenNumeros, TestCompatibilidad } from "@/components/guia/Guia";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";

export const metadata: Metadata = {
  title: "Guía para adoptar",
  description: "Checklist, test de compatibilidad, calculadora de costos y qué esperar los primeros días con tu mascota adoptada.",
};

export default function PaginaGuia() {
  return (
    <>
      <Cabecera
        foto="/img/banners/guia.jpg"
        antetitulo="Guía para adoptar"
        titulo="Todo lo que conviene saber antes de decir que sí."
        resaltar={["que", "sí."]}
        bajada="Un checklist honesto, un test que te recomienda mascotas reales, lo que cuesta por mes y cómo son los primeros días."
        migas={[{ texto: "Guía para adoptar" }]}
      >
        <div className="max-w-xl">
          <ResumenNumeros />
        </div>
      </Cabecera>

      <div className="contenedor pt-8">
        <NavGuia />
      </div>

      <section id="checklist" className="seccion scroll-mt !pt-14" aria-labelledby="t-check">
        <div className="contenedor">
          <EncabezadoSeccion id="t-check" antetitulo="Paso 1" titulo="¿Estás listo/a para adoptar?" bajada="Marcá lo que ya tenés resuelto. Se guarda en tu dispositivo." />
          <Checklist />
        </div>
      </section>

      <section id="test" className="seccion seccion-crema scroll-mt" aria-labelledby="t-test">
        <div className="contenedor">
          <EncabezadoSeccion
            id="t-test"
            centrado
            antetitulo="Paso 2 · Test de compatibilidad"
            titulo="¿Qué compañero va con tu vida?"
            resaltar={["tu", "vida?"]}
            bajada="5 preguntas. Te recomendamos mascotas reales de los refugios, con motivos y alertas."
          />
          <TestCompatibilidad />
        </div>
      </section>

      <section id="costos" className="seccion scroll-mt" aria-labelledby="t-costos">
        <div className="contenedor">
          <EncabezadoSeccion id="t-costos" antetitulo="Paso 3 · Calculadora" titulo="¿Cuánto cuesta por mes?" bajada="Adoptar es gratis, pero cuidarlo bien tiene costos. Armá tu presupuesto." />
          <Calculadora />
        </div>
      </section>

      <section id="preparar" className="seccion seccion-crema scroll-mt" aria-labelledby="t-prep">
        <div className="contenedor">
          <EncabezadoSeccion id="t-prep" antetitulo="Paso 4" titulo="Prepará la casa antes de que llegue." />
          <PrepararCasa />
        </div>
      </section>

      <section id="primeros-dias" className="seccion scroll-mt" aria-labelledby="t-dias">
        <div className="contenedor">
          <EncabezadoSeccion id="t-dias" centrado antetitulo="Paso 5" titulo="Los primeros días juntos." bajada="La adaptación lleva tiempo. Esto es lo normal, y no estás solo/a." />
          <PrimerosDias />
        </div>
      </section>
    </>
  );
}
