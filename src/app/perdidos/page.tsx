import type { Metadata } from "next";
import { CircleAlert, Search } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { Perdidos } from "@/components/comunidad/Perdidos";
import { Aparecer } from "@/components/ui/Movimiento";

export const metadata: Metadata = {
  title: "Perdidos y encontrados",
  description: "Reportá un perro o gato perdido o encontrado en Río Cuarto y ayudá a que vuelva a casa.",
};

const CONSEJOS = [
  {
    i: CircleAlert,
    t: "Si se te perdió",
    color: "bg-danger-bg text-danger",
    pasos: [
      "Recorré la zona en las horas en que hay menos ruido y llamalo por su nombre.",
      "Avisá a los refugios y veterinarias del barrio con una foto reciente.",
      "Publicá el reporte acá y compartilo en grupos del barrio.",
      "Si tiene chip, avisá a tu veterinaria para que quede marcado.",
    ],
  },
  {
    i: Search,
    t: "Si lo encontraste",
    color: "bg-success-bg text-success",
    pasos: [
      "Fijate si tiene chapita. Cualquier veterinaria puede leerle el chip gratis.",
      "Dale agua y un lugar seguro. No lo bañes: su olor ayuda a que lo reconozcan.",
      "Publicalo acá con foto y el barrio exacto donde lo viste.",
      "Si en 7 días nadie lo reclama, podés buscarle familia con un refugio.",
    ],
  },
];

export default function PaginaPerdidos() {
  return (
    <>
      <Cabecera
        foto="/img/banners/perdidos.jpg"
        antetitulo="Perdidos y encontrados"
        titulo="Ayudalos a volver a casa."
        resaltar={["volver", "a", "casa."]}
        bajada="Reportes de Río Cuarto en tiempo real. Las primeras 48 horas son las más importantes: compartí."
        migas={[{ texto: "Perdidos y encontrados" }]}
        foco="50% 30%"
      />
      <section className="contenedor py-14 lg:py-20" aria-label="Reportes">
        <Perdidos />
      </section>
      <section className="seccion seccion-crema" aria-label="Qué hacer">
        <div className="contenedor grid gap-6 md:grid-cols-2">
          {CONSEJOS.map((c, i) => (
            <Aparecer key={c.t} retraso={i * 0.1} className="tarjeta p-6 md:p-8">
              <span className={`grid size-12 place-items-center rounded-2xl ${c.color}`}>
                <c.i className="size-6" aria-hidden="true" />
              </span>
              <h2 className="t-h3 mt-4">{c.t}</h2>
              <ol className="mt-4 grid gap-3">
                {c.pasos.map((p, n) => (
                  <li key={p} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-sm font-bold">{n + 1}</span>
                    <span className="text-ink-2">{p}</span>
                  </li>
                ))}
              </ol>
            </Aparecer>
          ))}
        </div>
      </section>
    </>
  );
}
