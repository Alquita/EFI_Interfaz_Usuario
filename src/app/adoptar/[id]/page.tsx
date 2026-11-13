import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MASCOTAS } from "@/data/mascotas";
import { FormularioAdopcion } from "@/components/mascotas/FormularioAdopcion";

export function generateStaticParams() {
  return MASCOTAS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/adoptar/[id]">): Promise<Metadata> {
  const { id } = await params;
  const m = MASCOTAS.find((x) => x.id === id);
  return { title: m ? `Adoptar a ${m.nombre}` : "Solicitud de adopción" };
}

export default function Adoptar({ params }: PageProps<"/adoptar/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="contenedor grid gap-10 py-10 lg:grid-cols-[1fr_22rem] lg:py-14" aria-busy="true" aria-label="Cargando solicitud">
          <div className="esqueleto h-[34rem] !rounded-[1.5rem]" />
          <div className="esqueleto hidden h-[26rem] !rounded-[1.5rem] lg:block" />
        </div>
      }
    >
      <Contenido params={params} />
    </Suspense>
  );
}

async function Contenido({ params }: { params: PageProps<"/adoptar/[id]">["params"] }) {
  const { id } = await params;
  const m = MASCOTAS.find((x) => x.id === id);
  if (!m) notFound();
  return (
    <div className="contenedor py-10 lg:py-14">
      <FormularioAdopcion m={m} />
    </div>
  );
}
