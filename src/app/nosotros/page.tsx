import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { COMPARATIVA, FUNCIONALIDADES, PROBLEMAS, PROCESO, PUBLICOS, type Valor } from "@/data/presentacion";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer, Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { Huella } from "@/components/ui/Marca";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Por qué hicimos AdoptApp: la adopción responsable en Río Cuarto, ordenada y en un solo lugar.",
};

function Celda({ v }: { v: Valor }) {
  if (v === "si") return <span className="si inline-flex items-center gap-1.5"><CircleCheck className="size-5" aria-hidden="true" /> Sí</span>;
  if (v === "no") return <span className="no inline-flex items-center gap-1.5"><CircleX className="size-5" aria-hidden="true" /> No</span>;
  return <span className="quizas inline-flex items-center gap-1.5"><CircleMinus className="size-5" aria-hidden="true" /> A medias</span>;
}

export default function PaginaNosotros() {
  return (
    <>
      <Cabecera
        foto="/img/banners/nosotros.jpg"
        antetitulo="Nosotros"
        titulo="Adoptar no debería depender de un posteo que se pierde en el día."
        resaltar={["no", "debería"]}
        bajada="AdoptApp junta a refugios, rescatistas y familias de Río Cuarto en un solo lugar, con información clara y seguimiento."
        migas={[{ texto: "Nosotros" }]}
      />

      <section className="seccion" aria-labelledby="t-prob">
        <div className="contenedor">
          <EncabezadoSeccion id="t-prob" antetitulo="El problema" titulo="Hoy adoptar es más difícil de lo que tendría que ser." />
          <Escalonado className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMAS.map((p) => (
              <ItemEscalonado key={p.n} className="tarjeta relative overflow-hidden p-6">
                <span className="pointer-events-none absolute -right-2 -top-6 text-8xl font-black text-brand-deco/10">{p.n}</span>
                <h3 className="t-h4 relative">{p.titulo}</h3>
                <p className="relative mt-2 text-ink-2">{p.texto}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className="seccion seccion-crema" aria-labelledby="t-comp">
        <div className="contenedor">
          <EncabezadoSeccion
            id="t-comp"
            antetitulo="Lo que nos hace distintos"
            titulo="AdoptApp frente a las alternativas."
            resaltar={["AdoptApp"]}
            bajada="Comparamos con grupos de redes sociales y apps de adopción generales."
          />
          <Aparecer className="tabla-wrap">
            <table className="tabla">
              <caption className="sr-only">Comparativa entre redes sociales, otras apps y AdoptApp</caption>
              <thead>
                <tr>
                  <th scope="col">Característica</th>
                  <th scope="col">Redes sociales</th>
                  <th scope="col">Otras apps</th>
                  <th scope="col" className="!bg-accent !text-white">
                    <span className="inline-flex items-center gap-2">
                      <Huella className="size-5" /> AdoptApp
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA.map((c) => (
                  <tr key={c.caracteristica}>
                    <th scope="row" className="!w-auto !text-ink">
                      {c.caracteristica}
                    </th>
                    <td>
                      <Celda v={c.redes} />
                    </td>
                    <td>
                      <Celda v={c.apps} />
                    </td>
                    <td className="bg-accent-soft">
                      <Celda v={c.adoptapp} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Aparecer>
        </div>
      </section>

      <section className="seccion" aria-labelledby="t-pub">
        <div className="contenedor">
          <EncabezadoSeccion id="t-pub" antetitulo="Para quién" titulo="Pensada para tres tipos de personas." />
          <Escalonado className="grid gap-6 md:grid-cols-3" paso={0.12}>
            {PUBLICOS.map((p) => (
              <ItemEscalonado key={p.titulo} className="tarjeta eleva group flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={p.foto} alt={p.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="t-h4">{p.titulo}</h3>
                  <p className="mt-2 flex-1 text-ink-2">{p.texto}</p>
                  <Link href={p.cta.href} className="enlace mt-5 inline-flex w-fit items-center gap-1.5">
                    {p.cta.texto} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className="seccion bg-brown text-white" aria-labelledby="t-func">
        <div className="contenedor">
          <EncabezadoSeccion id="t-func" claro antetitulo="Funcionalidades" titulo="Todo lo que podés hacer." />
          <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUNCIONALIDADES.map((f) => (
              <ItemEscalonado key={f.titulo} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors hover:bg-white/[0.09]">
                <span className="grid size-9 place-items-center rounded-full bg-accent">
                  <Check className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold">{f.titulo}</h3>
                <p className="mt-1 text-[#e7d9d1]">{f.texto}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className="seccion" aria-labelledby="t-proc">
        <div className="contenedor">
          <EncabezadoSeccion id="t-proc" antetitulo="Cómo la hicimos" titulo="De la idea a la web que estás mirando." bajada="Proyecto EFI de Interfaz: proceso de diseño centrado en las personas." />
          <Escalonado como="ol" className="relative grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {PROCESO.map((p) => (
              <ItemEscalonado key={p.n} como="li" className="relative">
                <span className="paso-numero">{p.n}</span>
                <h3 className="t-h4 mt-4">{p.titulo}</h3>
                <p className="mt-1 text-ink-2">{p.texto}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>
    </>
  );
}
