import type { Metadata } from "next";
import { Package } from "lucide-react";
import { LISTA_REFUGIOS } from "@/data/refugios";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer } from "@/components/ui/Movimiento";
import { Apadrinar, Donar } from "@/components/comunidad/Donar";
import { BarrasNecesidad } from "@/components/comunidad/Refugios";

export const metadata: Metadata = {
  title: "Donar y apadrinar",
  description: "Doná para castraciones, vacunas y alimento, o apadriná a una mascota que espera familia en Río Cuarto.",
};

export default function PaginaDonar() {
  return (
    <>
      <Cabecera
        foto="/img/banners/donar.jpg"
        antetitulo="Donar y apadrinar"
        titulo="Cada peso se convierte en un plato lleno."
        resaltar={["plato", "lleno."]}
        bajada="Elegí el destino y el refugio. Ves exactamente qué cubre tu aporte."
        migas={[{ texto: "Donar" }]}
      />
      <section className="contenedor py-14 lg:py-20" aria-label="Donación">
        <Donar />
      </section>
      <section id="apadrinar" className="seccion seccion-crema scroll-mt" aria-labelledby="t-apa">
        <div className="contenedor">
          <EncabezadoSeccion
            id="t-apa"
            antetitulo="Apadrinar"
            titulo="Los que más tardan en encontrar hogar."
            bajada="Seniors y adultos que esperan hace meses. Apadrinarlos cubre su día a día y recibís novedades."
          />
          <Apadrinar />
        </div>
      </section>
      <section className="seccion" aria-labelledby="t-esp">
        <div className="contenedor">
          <EncabezadoSeccion id="t-esp" antetitulo="Donaciones en especie" titulo="Qué necesita cada refugio hoy." bajada="Podés llevarlo en su horario de visitas." />
          <div className="grid gap-5 md:grid-cols-3">
            {LISTA_REFUGIOS.map((r, i) => (
              <Aparecer key={r.id} retraso={i * 0.08} className="tarjeta p-6">
                <p className="t-h4 flex items-center gap-2">
                  <Package className="size-5 text-brand" aria-hidden="true" /> {r.nombre}
                </p>
                <p className="mb-5 text-sm text-ink-2">{r.horario}</p>
                <BarrasNecesidad necesidades={r.necesidades} />
              </Aparecer>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
