import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Gift, MapPin, Navigation, PawPrint, Phone, Users } from "lucide-react";
import type { RefugioId } from "@/types";
import { LISTA_REFUGIOS, REFUGIOS } from "@/data/refugios";
import { MASCOTAS } from "@/data/mascotas";
import { HISTORIAS } from "@/data/historias";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer, Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { TarjetaMascota } from "@/components/mascotas/TarjetaMascota";
import { MapaRefugios } from "@/components/mapa/MapaRefugios";
import { BarrasNecesidad } from "@/components/comunidad/Refugios";

export function generateStaticParams() {
  return LISTA_REFUGIOS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/refugios/[id]">): Promise<Metadata> {
  const { id } = await params;
  const r = REFUGIOS[id as RefugioId];
  return { title: r ? r.nombre : "Refugio", description: r?.descripcion };
}

export default function PaginaRefugio({ params }: PageProps<"/refugios/[id]">) {
  return (
    <Suspense
      fallback={
        <div aria-busy="true" aria-label="Cargando refugio">
          <div className="cabecera">
            <div className="contenedor grid gap-4">
              <div className="h-5 w-40 rounded-full bg-white/15" />
              <div className="h-14 w-2/3 rounded-xl bg-white/15" />
              <div className="h-6 w-1/2 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      }
    >
      <Refugio params={params} />
    </Suspense>
  );
}

async function Refugio({ params }: { params: PageProps<"/refugios/[id]">["params"] }) {
  const { id } = await params;
  const r = REFUGIOS[id as RefugioId];
  if (!r) notFound();
  const suyas = MASCOTAS.filter((m) => m.refugio === r.id);
  const historias = HISTORIAS.filter((h) => h.refugio === r.id);

  return (
    <>
      <Cabecera
        foto={r.foto}
        antetitulo={`${r.especies} · ${r.barrio}`}
        titulo={r.nombre}
        bajada={r.descripcion}
        migas={[{ href: "/refugios", texto: "Refugios" }, { texto: r.nombre }]}
      >
        <div className="flex flex-wrap gap-3">
          <a href={`tel:${r.telefono.replace(/\s/g, "")}`} className="btn btn-primario">
            <Phone className="size-5" aria-hidden="true" /> {r.telefono}
          </a>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${r.coordenadas.join(",")}`} target="_blank" rel="noreferrer" className="btn btn-vidrio">
            <Navigation className="size-5" aria-hidden="true" /> Cómo llegar
          </a>
        </div>
      </Cabecera>

      <section className="contenedor grid gap-6 py-14 md:grid-cols-3" aria-label="Datos del refugio">
        {[
          { i: Clock, t: "Horario de visitas", v: r.horarioLargo },
          { i: MapPin, t: "Dónde queda", v: `${r.barrio}, a ${String(r.distancia).replace(".", ",")} km de vos` },
          { i: PawPrint, t: "En adopción", v: `${suyas.length} esperando familia` },
        ].map((d, i) => (
          <Aparecer key={d.t} retraso={i * 0.08} className="tarjeta p-6">
            <d.i className="size-6 text-brand" aria-hidden="true" />
            <p className="mt-3 text-sm text-ink-2">{d.t}</p>
            <p className="mt-1 text-lg font-semibold">{d.v}</p>
          </Aparecer>
        ))}
      </section>

      <section className="contenedor" aria-labelledby="t-suyas">
        <EncabezadoSeccion id="t-suyas" antetitulo="Sus animales" titulo={`Esperan en ${r.nombre}.`} />
        <Escalonado className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {suyas.map((m) => (
            <ItemEscalonado key={m.id}>
              <TarjetaMascota m={m} morph />
            </ItemEscalonado>
          ))}
        </Escalonado>
      </section>

      <section className="contenedor grid gap-8 py-20 lg:grid-cols-2" aria-labelledby="t-ayudar">
        <div className="tarjeta p-6 md:p-8">
          <h2 id="t-ayudar" className="t-h3">
            Qué necesita esta semana
          </h2>
          <p className="mt-2 text-ink-2">Podés llevar donaciones en su horario de visitas o donar online.</p>
          <div className="mt-6">
            <BarrasNecesidad necesidades={r.necesidades} />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/donar" className="btn btn-primario">
              <Gift className="size-5" aria-hidden="true" /> Donar
            </Link>
            <Link href="/voluntariado" className="btn btn-secundario">
              <Users className="size-5" aria-hidden="true" /> Ser voluntario/a
            </Link>
          </div>
        </div>
        <MapaRefugios solo={r.id} mostrarYo={false} className="min-h-[22rem]" />
      </section>

      {historias.length > 0 && (
        <section className="seccion seccion-crema" aria-labelledby="t-hist">
          <div className="contenedor">
            <EncabezadoSeccion id="t-hist" antetitulo="Adoptados" titulo={`Familias que adoptaron en ${r.nombre}.`} accion={{ href: "/historias", texto: "Más historias" }} />
            <div className="grid gap-6 md:grid-cols-2">
              {historias.map((h) => (
                <Aparecer key={h.id} className="tarjeta grid overflow-hidden sm:grid-cols-[12rem_1fr]">
                  <div className="relative aspect-[4/3] sm:aspect-auto">
                    <Image src={h.foto} alt={h.alt} fill sizes="12rem" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold text-brand">{h.fecha}</p>
                    <h3 className="t-h4 mt-1">{h.titulo}</h3>
                    <blockquote className="mt-2 text-ink-2">“{h.cita}”</blockquote>
                  </div>
                </Aparecer>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
