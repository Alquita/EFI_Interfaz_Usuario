import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock,
  Compass,
  Heart,
  Keyboard,
  MapPin,
  Megaphone,
  MousePointerClick,
  PawPrint,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { MASCOTAS } from "@/data/mascotas";
import { HISTORIAS } from "@/data/historias";
import { EVENTOS } from "@/data/eventos";
import { REFUGIOS } from "@/data/refugios";
import { PASOS_ADOPCION } from "@/data/presentacion";
import { cn, partesFecha } from "@/lib/utils";
import { Aparecer, Contador, Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Carrusel } from "@/components/ui/Carrusel";
import { Huella } from "@/components/ui/Marca";
import { TarjetaMascota } from "@/components/mascotas/TarjetaMascota";

/* ------------------------------------------------------------------ Impacto */
export function Impacto() {
  const disponibles = MASCOTAS.filter((m) => m.estado === "disponible").length;
  const datos = [
    { valor: disponibles, sufijo: "", texto: "perros y gatos buscan hogar hoy" },
    { valor: 126, sufijo: "", texto: "adopciones en 2026" },
    { valor: 3, sufijo: "", texto: "refugios aliados en la ciudad" },
    { valor: 48, sufijo: " h", texto: "de respuesta promedio" },
  ];
  return (
    <section aria-label="AdoptApp en números" className="border-b border-line">
      <div className="contenedor grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
        {datos.map((d, i) => (
          <Aparecer key={d.texto} retraso={i * 0.08} className={cn("px-2 lg:px-8", i > 0 && "lg:border-l lg:border-line")}>
            <p className="text-[2.75rem] font-bold leading-none tracking-[-0.04em] md:text-6xl">
              <Contador valor={d.valor} sufijo={d.sufijo} className={i === 0 ? "text-brand" : undefined} />
            </p>
            <p className="mt-2 text-ink-2">{d.texto}</p>
          </Aparecer>
        ))}
      </div>
      <div className="marquee border-t border-line py-4" aria-hidden="true">
        <div className="marquee-pista">
          {[...MASCOTAS, ...MASCOTAS].map((m, i) => (
            <span key={i} className="inline-flex shrink-0 items-center gap-3 rounded-full border border-line bg-card py-1.5 pl-1.5 pr-5">
              <span className="relative size-9 overflow-hidden rounded-full">
                <Image src={m.foto} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="font-semibold">{m.nombre}</span>
              <span className="text-sm text-ink-2">{m.barrio}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Recién llegados */
export function RecienLlegados() {
  const recientes = [...MASCOTAS].sort((a, b) => b.publicado.localeCompare(a.publicado)).slice(0, 8);
  return (
    <section className="seccion overflow-hidden" aria-labelledby="t-recientes">
      <div className="contenedor">
        <EncabezadoSeccion
          id="t-recientes"
          antetitulo="Recién llegados"
          titulo="Llegaron esta semana y ya quieren conocerte."
          resaltar={["conocerte."]}
          bajada="Las fichas más nuevas de los refugios. Guardá las que te gusten y pensalo con calma."
          accion={{ href: "/?orden=recientes#mascotas", texto: "Ver todas" }}
        />
        <Carrusel etiqueta="Mascotas recién llegadas" claseSlide="basis-[82%] sm:basis-[46%] lg:basis-[31%] xl:basis-[24%]">
          {recientes.map((m, i) => (
            <TarjetaMascota key={m.id} m={m} prioridad={i < 2} />
          ))}
        </Carrusel>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Cómo funciona */
function Ilustracion({ paso }: { paso: number }) {
  if (paso === 0)
    return (
      <div className="grid gap-2.5">
        <div className="flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2.5 text-sm text-ink-2">
          <Search className="size-4" aria-hidden="true" /> Perro mediano en Alberdi…
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Perros", "Mediano", "Joven", "Castrado"].map((t, i) => (
            <span key={t} className={cn("rounded-full px-3 py-1 text-sm font-semibold", i < 2 ? "bg-accent text-white" : "border border-line bg-bg")}>
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  if (paso === 1)
    return (
      <div className="grid gap-2">
        {[
          ["Vacunada", true],
          ["Castrada", true],
          ["Convive con gatos", null],
        ].map(([t, v]) => (
          <div key={String(t)} className="flex items-center justify-between rounded-xl border border-line bg-bg px-3.5 py-2 text-sm">
            <span>{t}</span>
            {v ? (
              <span className="flex items-center gap-1 font-semibold text-success">
                <CircleCheck className="size-4" aria-hidden="true" /> Sí
              </span>
            ) : (
              <span className="font-semibold text-review">A probar</span>
            )}
          </div>
        ))}
      </div>
    );
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((n) => (
          <span key={n} className="h-1.5 rounded-full bg-accent" />
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3">
        <span className="relative size-10 overflow-hidden rounded-lg">
          <Image src="/img/mascotas/simon.jpg" alt="" fill sizes="40px" className="object-cover" />
        </span>
        <span className="flex-1 text-sm">
          <span className="block font-semibold">Solicitud por Simón</span>
          <span className="text-ink-2">Hogar Gatuno RC</span>
        </span>
        <span className="estado estado-exito !min-h-7 text-xs">
          <Check className="size-3.5" aria-hidden="true" /> Aprobada
        </span>
      </div>
    </div>
  );
}

export function ComoFunciona() {
  return (
    <section className="seccion seccion-crema relative overflow-hidden" aria-labelledby="t-como">
      <Huella className="pointer-events-none absolute -left-20 top-10 size-80 -rotate-12 text-brand-deco/[0.06]" />
      <div className="contenedor relative">
        <EncabezadoSeccion
          id="t-como"
          centrado
          antetitulo="Cómo funciona"
          titulo="Adoptar en 3 pasos, sin vueltas."
          resaltar={["3", "pasos,"]}
          bajada="Todo lo que necesitás saber antes de decidir, y un seguimiento claro después."
        />
        <svg className="pointer-events-none absolute left-[16%] right-[16%] top-[17.5rem] hidden h-24 w-[68%] lg:block" viewBox="0 0 800 100" fill="none" aria-hidden="true">
          <path
            d="M10 60 C 150 -10, 250 110, 400 50 S 650 -10, 790 60"
            stroke="var(--brand-deco)"
            strokeWidth="2.5"
            strokeDasharray="8 10"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        <Escalonado className="relative grid gap-6 lg:grid-cols-3" paso={0.14}>
          {PASOS_ADOPCION.map((p, i) => (
            <ItemEscalonado key={p.n} className="tarjeta eleva group relative flex flex-col overflow-hidden p-7">
              <span className="pointer-events-none absolute -right-3 -top-8 text-[9rem] font-black leading-none tracking-tighter text-brand-deco/10 transition-transform duration-500 group-hover:-translate-y-2">
                {p.n}
              </span>
              <span className="paso-numero relative">{i + 1}</span>
              <h3 className="t-h3 mt-6">{p.titulo}</h3>
              <p className="mt-2 text-ink-2">{p.texto}</p>
              <div className="mt-6 rounded-2xl bg-surface p-4">
                <Ilustracion paso={i} />
              </div>
            </ItemEscalonado>
          ))}
        </Escalonado>
        <Aparecer className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link href="/#mascotas" className="btn btn-primario btn-lg">
            Empezar a buscar
          </Link>
          <Link href="/guia" className="btn btn-secundario btn-lg">
            Leer la guía para adoptar
          </Link>
        </Aparecer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Descubrir */
export function DescubrirPromo() {
  const fan = ["copito", "mora", "coco"].map((id) => MASCOTAS.find((m) => m.id === id)!);
  return (
    <section className="seccion" aria-labelledby="t-descubrir">
      <div className="contenedor">
        <div className="panel-marron relative isolate overflow-hidden px-6 py-14 md:px-14 lg:py-20">
          <div className="textura-huellas absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
          <div className="absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Aparecer>
                <p className="pastilla vidrio">
                  <Sparkles className="ml-1 size-4 text-[#fdba74]" aria-hidden="true" />
                  Nuevo · Solo en AdoptApp
                </p>
              </Aparecer>
              <h2 id="t-descubrir" className="t-h2 sobre-oscuro mt-5">
                Deslizá, enamorate, <span className="palabra-marcada">adoptá</span>.
              </h2>
              <Aparecer retraso={0.1}>
                <p className="mt-4 max-w-lg text-lg text-[#e7d9d1]">
                  Conocé a las mascotas de a una, como en una app de citas pero con final feliz. Las que te gustan van
                  directo a favoritos, con tu porcentaje de compatibilidad.
                </p>
              </Aparecer>
              <Escalonado className="mt-8 grid gap-3" como="ul">
                {[
                  { i: MousePointerClick, t: "Arrastrá la tarjeta o tocá los botones" },
                  { i: Keyboard, t: "Con teclado: flecha derecha me gusta, izquierda paso" },
                  { i: Compass, t: "Si hiciste el test, te mostramos tu % de match" },
                ].map((x) => (
                  <ItemEscalonado key={x.t} como="li" className="flex items-center gap-3 text-[#f5ebe5]">
                    <span className="grid size-10 place-items-center rounded-xl bg-white/10">
                      <x.i className="size-5 text-[#fdba74]" aria-hidden="true" />
                    </span>
                    {x.t}
                  </ItemEscalonado>
                ))}
              </Escalonado>
              <Aparecer retraso={0.25} className="mt-10">
                <Link href="/descubrir" className="btn btn-blanco btn-lg group">
                  Probar Descubrir
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Aparecer>
            </div>

            <Aparecer desde="escala" className="group relative mx-auto h-[26rem] w-full max-w-sm sm:h-[30rem]">
              {fan.map((m, i) => {
                const rot = [-9, 7, 0][i];
                const x = [-34, 34, 0][i];
                return (
                  <div
                    key={m.id}
                    className="absolute inset-0 overflow-hidden rounded-[2rem] border-4 border-white/90 bg-surface-2 shadow-e3 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{
                      transform: `translateX(${x * 0.4}px) rotate(${rot}deg)`,
                      ["--rot-hover" as string]: `translateX(${x * 2.2}px) rotate(${rot * 1.6}deg)`,
                    }}
                    data-abanico
                  >
                    <Image src={m.foto} alt={i === 2 ? m.alt : ""} fill sizes="24rem" className="object-cover" />
                    {i === 2 && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24 text-white">
                        <p className="text-3xl font-bold">
                          {m.nombre}, <span className="font-medium">{m.edad}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-white/85">
                          <MapPin className="size-4" aria-hidden="true" /> {m.barrio} · a {String(m.distancia).replace(".", ",")} km
                        </p>
                        <div className="mt-5 flex justify-center gap-5">
                          <span className="grid size-14 place-items-center rounded-full bg-white text-danger shadow-e2">
                            <X className="size-7" aria-hidden="true" />
                          </span>
                          <span className="grid size-14 place-items-center rounded-full bg-accent text-white shadow-marca">
                            <Heart className="size-7 fill-current" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Aparecer>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Test de compatibilidad */
export function TestPromo() {
  const lola = MASCOTAS.find((m) => m.id === "lola")!;
  return (
    <section className="seccion pt-0" aria-labelledby="t-test">
      <div className="contenedor grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Aparecer desde="izquierda" className="relative order-2 lg:order-1">
          <div className="relative mx-auto max-w-md">
            <div className="forma-arco relative aspect-[4/5] overflow-hidden bg-surface-2">
              <Image src="/img/varios/amigos.jpg" alt="Dos perros sonrientes en el pasto" fill sizes="(min-width:1024px) 28rem, 90vw" className="object-cover" />
            </div>
            <div className="tarjeta flotar absolute -right-4 bottom-10 flex w-64 items-center gap-4 p-4 shadow-e3 sm:-right-12" style={{ ["--rot" as string]: "-2deg" }}>
              <span className="anillo" style={{ ["--p" as string]: 92 }}>
                <span>92%</span>
              </span>
              <span>
                <span className="block text-sm text-ink-2">Tu match con</span>
                <span className="block text-lg font-bold">{lola.nombre}</span>
                <span className="block text-sm text-success">Se lleva bien con chicos</span>
              </span>
            </div>
            <div className="tarjeta flotar absolute -left-4 top-10 flex items-center gap-3 p-3 pr-5 shadow-e3 sm:-left-10" style={{ ["--rot" as string]: "3deg", animationDelay: "1.5s" }}>
              <span className="grid size-10 place-items-center rounded-full bg-success-bg text-success">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">
                5 preguntas
                <br />
                <span className="font-normal text-ink-2">1 minuto</span>
              </span>
            </div>
          </div>
        </Aparecer>
        <div className="order-1 lg:order-2">
          <EncabezadoSeccion
            id="t-test"
            className="!mb-6"
            antetitulo="Test de compatibilidad"
            titulo="¿Qué compañero va con tu vida?"
            resaltar={["tu", "vida?"]}
            bajada="Contanos cómo es tu casa, tu tiempo y con quién vivís. Te recomendamos mascotas reales de los refugios, con los motivos y las alertas a tener en cuenta."
          />
          <Escalonado className="flex flex-wrap gap-2" como="ul">
            {["¿Dónde vivís?", "¿Cuánto tiempo tenés?", "¿Hay chicos?", "¿Otros animales?", "¿Perro o gato?"].map((p) => (
              <ItemEscalonado key={p} como="li" className="tag tag-suave">
                {p}
              </ItemEscalonado>
            ))}
          </Escalonado>
          <Aparecer retraso={0.2} className="mt-8 flex flex-wrap gap-3">
            <Link href="/guia#test" className="btn btn-primario btn-lg">
              <Compass className="size-5" aria-hidden="true" /> Hacer el test
            </Link>
            <Link href="/guia#costos" className="btn btn-fantasma btn-lg">
              Calcular cuánto cuesta
            </Link>
          </Aparecer>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Historias */
export function HistoriasInicio() {
  return (
    <section className="seccion bg-brown text-white" aria-labelledby="t-historias">
      <div className="contenedor">
        <EncabezadoSeccion
          id="t-historias"
          claro
          antetitulo="Historias reales"
          titulo="Familias que empezaron acá."
          resaltar={["acá."]}
          bajada="Adoptar cambia dos vidas. Estas son algunas de las historias que nos mandaron."
          accion={{ href: "/historias", texto: "Leer todas" }}
        />
        <Carrusel etiqueta="Historias de adopción" claseSlide="basis-[88%] md:basis-1/2 lg:basis-[40%]" autoplay loop claro>
          {HISTORIAS.map((h) => (
            <article key={h.id} className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.05]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={h.foto} alt={h.alt} fill sizes="(min-width:1024px) 40vw, 88vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-sm font-semibold backdrop-blur">
                  {h.fecha}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="comillas -mb-6 -mt-2" aria-hidden="true">
                  “
                </span>
                <blockquote className="text-lg font-medium leading-7">{h.cita}</blockquote>
                <p className="mt-auto pt-5 text-sm text-[#e7d9d1]">
                  <strong className="text-white">{h.quienes}</strong> adoptaron a {h.mascota} · {REFUGIOS[h.refugio].nombre}
                </p>
              </div>
            </article>
          ))}
        </Carrusel>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Eventos */
export function EventosInicio() {
  const proximos = EVENTOS.slice(0, 3);
  return (
    <section className="seccion" aria-labelledby="t-eventos">
      <div className="contenedor">
        <EncabezadoSeccion
          id="t-eventos"
          antetitulo="Agenda"
          titulo="Próximos eventos en Río Cuarto."
          bajada="Ferias de adopción, castraciones gratuitas, vacunación y charlas."
          accion={{ href: "/eventos", texto: "Ver la agenda" }}
        />
        <Escalonado className="grid gap-5 md:grid-cols-3" paso={0.1}>
          {proximos.map((e) => {
            const f = partesFecha(e.fecha);
            return (
              <ItemEscalonado key={e.id} className="tarjeta eleva flex flex-col p-6">
                <div className="flex items-start gap-4">
                  <span className="fecha-evento">
                    <b>{f.dia}</b>
                    <small>{f.mes}</small>
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize text-brand">{f.diaSemana}</p>
                    <h3 className="t-h4 mt-1">{e.titulo}</h3>
                  </div>
                </div>
                <p className="mt-4 text-ink-2">{e.descripcion}</p>
                <div className="mt-auto grid gap-1.5 pt-5 text-[0.9375rem] text-ink-2">
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 text-brand" aria-hidden="true" /> {e.hora}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand" aria-hidden="true" /> {e.lugar}
                  </span>
                </div>
              </ItemEscalonado>
            );
          })}
        </Escalonado>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Comunidad (bento) */
export function Comunidad() {
  const items = [
    { href: "/transito", foto: "/img/banners/transito.jpg", t: "Hogar de tránsito", s: "Cuidá a un animal unas semanas mientras encuentra familia. El refugio cubre alimento y veterinario.", tag: "Más pedido" },
    { href: "/voluntariado", foto: "/img/varios/paseador.jpg", t: "Voluntariado", s: "Paseos, fotos, traslados y difusión." },
    { href: "/donar", foto: "/img/varios/alimento.jpg", t: "Donar y apadrinar", s: "Alimento, vacunas y castraciones." },
    { href: "/perdidos", foto: "/img/banners/perdidos.jpg", t: "Perdidos y encontrados", s: "Reportá o ayudá a buscar." },
  ];
  return (
    <section className="seccion seccion-crema" aria-labelledby="t-comunidad">
      <div className="contenedor">
        <EncabezadoSeccion
          id="t-comunidad"
          antetitulo="Comunidad"
          titulo="Si hoy no podés adoptar, igual podés ayudar."
          resaltar={["ayudar."]}
          bajada="Hay muchas formas de sumarte a los refugios de Río Cuarto."
        />
        <Escalonado className="bento" paso={0.1}>
          {items.map((it, i) => (
            <ItemEscalonado key={it.href} className="h-full">
              <Link href={it.href} className="bento-item h-full">
                <Image src={it.foto} alt="" fill sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 100vw"} />
                <span className="flecha grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
                {it.tag && <span className="mb-auto w-fit rounded-full bg-accent px-3 py-1 text-sm font-bold">{it.tag}</span>}
                <span className={cn("block font-bold tracking-tight", i === 0 ? "text-3xl md:text-4xl" : "text-2xl")}>{it.t}</span>
                <span className={cn("mt-1 block text-white/85", i === 0 && "max-w-md text-lg")}>{it.s}</span>
              </Link>
            </ItemEscalonado>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CTA final */
export function CtaFinal() {
  const fila1 = MASCOTAS.slice(0, 9);
  const fila2 = MASCOTAS.slice(9);
  return (
    <section className="contenedor" aria-labelledby="t-cta">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-accent px-6 py-20 text-white md:px-16 md:py-28">
        <div className="absolute inset-0 -z-10 -rotate-6 scale-125 opacity-25" aria-hidden="true">
          {[fila1, fila2].map((fila, i) => (
            <div key={i} className="marquee mb-5 [mask-image:none]">
              <div className={cn("marquee-pista", i === 1 && "al-reves")} style={{ animationDuration: "70s" }}>
                {[...fila, ...fila].map((m, j) => (
                  <span key={j} className="relative block h-40 w-56 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={m.foto} alt="" fill sizes="14rem" className="object-cover" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#9a3412]/90 via-[#c2410c]/80 to-[#7c2d12]/95" aria-hidden="true" />
        <div className="mx-auto max-w-3xl text-center">
          <Aparecer>
            <Huella className="mx-auto size-12 text-white/90" />
          </Aparecer>
          <h2 id="t-cta" className="t-h1 mt-6">
            Hay alguien esperándote. Y tal vez ya lo viste.
          </h2>
          <Aparecer retraso={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
              Mirá el catálogo, hacé el test o publicá un animal que necesita hogar. Todo es gratis.
            </p>
          </Aparecer>
          <Aparecer retraso={0.2} className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/#mascotas" className="btn btn-blanco btn-lg">
              <PawPrint className="size-5" aria-hidden="true" /> Ver mascotas
            </Link>
            <Link href="/dar-en-adopcion" className="btn btn-vidrio btn-lg">
              <Megaphone className="size-5" aria-hidden="true" /> Dar en adopción
            </Link>
            <Link href="/eventos" className="btn btn-vidrio btn-lg">
              <CalendarDays className="size-5" aria-hidden="true" /> Ir a una feria
            </Link>
          </Aparecer>
        </div>
      </div>
    </section>
  );
}
