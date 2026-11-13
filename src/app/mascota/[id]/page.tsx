import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { MASCOTAS } from "@/data/mascotas";
import { AccionesFicha, GaleriaFicha, PestanasFicha } from "@/components/mascotas/Ficha";
import { TarjetaMascota } from "@/components/mascotas/TarjetaMascota";
import { Carrusel } from "@/components/ui/Carrusel";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer } from "@/components/ui/Movimiento";

export function generateStaticParams() {
  return MASCOTAS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/mascota/[id]">): Promise<Metadata> {
  const { id } = await params;
  const m = MASCOTAS.find((x) => x.id === id);
  if (!m) return { title: "Mascota no encontrada" };
  return {
    title: `${m.nombre}, ${m.tipo.toLowerCase()} de ${m.edad}`,
    description: m.temperamento,
    openGraph: { images: [m.foto] },
  };
}

/* Lo que depende de params va dentro de <Suspense>: la navegación es instantánea
   (se ve el esqueleto) y la ficha entra apenas se resuelve el id. */
export default function FichaMascota({ params }: PageProps<"/mascota/[id]">) {
  return (
    <Suspense fallback={<FichaCargando />}>
      <Ficha params={params} />
    </Suspense>
  );
}

function FichaCargando() {
  return (
    <div className="contenedor pt-6 lg:pt-10" aria-busy="true" aria-label="Cargando ficha">
      <div className="esqueleto h-10 w-56 !rounded-full" />
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="esqueleto aspect-[4/3.6] !rounded-[2rem] lg:aspect-[4/4.2]" />
        <div className="grid content-start gap-4">
          <div className="esqueleto h-8 w-40 !rounded-full" />
          <div className="esqueleto h-14 w-2/3" />
          <div className="esqueleto h-6 w-3/4" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="esqueleto h-24 !rounded-2xl" />
            ))}
          </div>
          <div className="esqueleto h-14 !rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

async function Ficha({ params }: { params: PageProps<"/mascota/[id]">["params"] }) {
  const { id } = await params;
  const m = MASCOTAS.find((x) => x.id === id);
  if (!m) notFound();

  const similares = MASCOTAS.filter((x) => x.id !== m.id && x.especie === m.especie)
    .sort((a, b) => Math.abs(a.edadMeses - m.edadMeses) - Math.abs(b.edadMeses - m.edadMeses))
    .slice(0, 6);

  return (
    <>
      <div className="contenedor pt-6 lg:pt-10">
        <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1.5 text-[0.9375rem] text-ink-2">
          <Link href="/#mascotas" className="btn btn-fantasma btn-sm -ml-3 !px-3">
            <ArrowLeft className="size-4" aria-hidden="true" /> Mascotas
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span>{m.especie === "perro" ? "Perros" : "Gatos"}</span>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-ink">
            {m.nombre}
          </span>
        </nav>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <GaleriaFicha m={m} />
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <AccionesFicha m={m} />
          </div>
        </div>

        <Aparecer className="mt-16 border-t border-line pt-10">
          <PestanasFicha m={m} />
        </Aparecer>
      </div>

      {similares.length > 0 && (
        <section className="seccion overflow-hidden pb-0" aria-labelledby="t-similares">
          <div className="contenedor">
            <EncabezadoSeccion
              id="t-similares"
              antetitulo="También te pueden gustar"
              titulo={`Otros ${m.especie === "perro" ? "perros" : "gatos"} parecidos a ${m.nombre}.`}
              accion={{ href: `/?especie=${m.especie}#mascotas`, texto: "Ver todos" }}
            />
            <Carrusel etiqueta="Mascotas similares" claseSlide="basis-[82%] sm:basis-[46%] lg:basis-[31%] xl:basis-[24%]">
              {similares.map((s) => (
                <TarjetaMascota key={s.id} m={s} />
              ))}
            </Carrusel>
          </div>
        </section>
      )}
    </>
  );
}
