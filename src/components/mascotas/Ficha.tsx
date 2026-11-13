"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState, ViewTransition } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  Cat,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  Compass,
  Dog,
  Expand,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Ruler,
  Share2,
  Syringe,
  Baby,
  Weight,
  X,
  Venus,
  Mars,
  Cake,
  ShieldCheck,
} from "lucide-react";
import type { Convivencia, Mascota } from "@/types";
import { REFUGIOS } from "@/data/refugios";
import { COSTOS } from "@/data/guia";
import { acciones, useEstado } from "@/lib/store";
import { cn, compatibilidad, esNueva, etapaDe, HOY, NOMBRE_ETAPA, NOMBRE_TAMANO, pesos, haceCuanto } from "@/lib/utils";
import { BotonFavorito } from "./BotonFavorito";
import { MapaRefugios } from "@/components/mapa/MapaRefugios";

/* Días (0 = domingo) y horarios en que cada refugio recibe visitas */
const AGENDA = {
  huellitas: { dias: [6, 0], horas: ["10:00", "11:00", "12:00"] },
  gatuno: { dias: [1, 2, 3, 4, 5], horas: ["17:00", "18:00", "19:00"] },
  patitas: { dias: [6], horas: ["9:00", "10:00", "11:00"] },
} as const;

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function proximosDias(refugio: Mascota["refugio"], cantidad = 6) {
  const res: { iso: string; etiqueta: string; dia: string; num: number }[] = [];
  const d = new Date(HOY);
  while (res.length < cantidad) {
    d.setDate(d.getDate() + 1);
    if ((AGENDA[refugio].dias as readonly number[]).includes(d.getDay())) {
      res.push({
        iso: d.toISOString().slice(0, 10),
        etiqueta: `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`,
        dia: DIAS_CORTOS[d.getDay()],
        num: d.getDate(),
      });
    }
  }
  return res;
}

export function costoMensual(m: Mascota) {
  const alimento = m.especie === "gato" ? COSTOS.alimento.gato : COSTOS.alimento[m.tamano];
  const higiene = m.especie === "gato" ? COSTOS.higiene.gato : COSTOS.higiene.perro;
  return [
    { t: "Alimento", v: alimento },
    { t: m.especie === "gato" ? "Piedras sanitarias" : "Higiene", v: higiene },
    { t: "Antiparasitarios", v: COSTOS.antiparasitarios },
    { t: "Veterinaria (promedio)", v: COSTOS.veterinaria },
  ];
}

/* ------------------------------------------------------------------ Galería */
export function GaleriaFicha({ m }: { m: Mascota }) {
  const [abierto, setAbierto] = useState(false);
  /* Activity: si se navega con el visor abierto, se cierra al ocultarse la página */
  useLayoutEffect(() => () => setAbierto(false), []);

  return (
    <div className="relative">
      <div className="ficha-media aspect-[4/3.6] lg:aspect-[4/4.2]">
        <ViewTransition name={`foto-${m.id}`} share="morph" default="none">
          <Image src={m.foto} alt={m.alt} fill sizes="(min-width:1024px) 55vw, 100vw" loading="eager" fetchPriority="high" />
        </ViewTransition>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {esNueva(m) && <span className="insignia insignia-nueva">Nuevo</span>}
          {m.edadMeses >= 96 && <span className="insignia">Senior</span>}
          <span className="insignia">Publicado {haceCuanto(m.publicado).toLowerCase()}</span>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <BotonFavorito id={m.id} nombre={m.nombre} grande />
        </div>
        <Dialog.Root open={abierto} onOpenChange={setAbierto}>
          <Dialog.Trigger className="btn btn-vidrio btn-sm absolute bottom-4 right-4">
            <Expand className="size-4" aria-hidden="true" /> Ver en grande
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content className="dlg-visor" aria-describedby={undefined}>
              <Dialog.Title className="sr-only">Foto de {m.nombre}</Dialog.Title>
              <motion.div
                className="relative h-[80dvh] w-[min(92vw,70rem)]"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <Image src={m.foto} alt={m.alt} fill sizes="92vw" className="object-contain" />
              </motion.div>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/85">{m.alt}</p>
              <Dialog.Close className="icon-btn icon-btn-vidrio absolute right-4 top-4" aria-label="Cerrar foto">
                <X className="size-6" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Columna de acciones */
export function AccionesFicha({ m }: { m: Mascota }) {
  const { test, visitas, solicitudes } = useEstado();
  const refugio = REFUGIOS[m.refugio];
  const compat = test ? compatibilidad(m, test) : null;
  const visita = visitas.find((v) => v.mascota === m.id);
  const solicitud = solicitudes.find((s) => s.mascota === m.id && s.estado !== "cancelada");
  const ella = m.sexo === "hembra";

  const compartir = async () => {
    const url = window.location.href;
    const datos = { title: `${m.nombre} busca hogar`, text: `Conocé a ${m.nombre} en AdoptApp`, url };
    try {
      if (navigator.share) await navigator.share(datos);
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Copiamos el enlace de la ficha");
      }
    } catch {
      /* el usuario canceló */
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {m.estado === "disponible" ? (
            <span className="estado estado-exito">
              <CircleCheck className="size-4" aria-hidden="true" /> Disponible
            </span>
          ) : (
            <span className="estado estado-revision">
              <Clock className="size-4" aria-hidden="true" /> Reservado
            </span>
          )}
          <span className="estado estado-neutro">
            {m.especie === "perro" ? <Dog className="size-4" aria-hidden="true" /> : <Cat className="size-4" aria-hidden="true" />}
            {m.tipo}
          </span>
        </div>
        <h1 className="t-h1 mt-4">{m.nombre}</h1>
        <p className="mt-2 flex items-center gap-2 text-lg text-ink-2">
          <MapPin className="size-5 text-brand" aria-hidden="true" />
          {m.barrio} · a {String(m.distancia).replace(".", ",")} km · {refugio.nombre}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { i: Cake, t: "Edad", v: `${m.edad}`, s: NOMBRE_ETAPA[etapaDe(m.edadMeses)] },
          { i: ella ? Venus : Mars, t: "Sexo", v: ella ? "Hembra" : "Macho", s: m.castrado ? (ella ? "Castrada" : "Castrado") : "Sin castrar" },
          { i: Ruler, t: "Tamaño", v: NOMBRE_TAMANO[m.tamano], s: "de adulto" },
          { i: Weight, t: "Peso", v: m.peso, s: "aprox." },
        ].map((d) => (
          <div key={d.t} className="rounded-2xl bg-surface p-4">
            <dt className="flex items-center gap-1.5 text-sm text-ink-2">
              <d.i className="size-4 text-brand" aria-hidden="true" /> {d.t}
            </dt>
            <dd className="mt-1 text-lg font-bold leading-6">{d.v}</dd>
            <dd className="text-sm text-ink-2">{d.s}</dd>
          </div>
        ))}
      </dl>

      {compat ? (
        <div className="panel-marca flex items-center gap-4 p-5">
          <span className="anillo" style={{ ["--p" as string]: compat.puntos }}>
            <span>{compat.puntos}%</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">Tu compatibilidad con {m.nombre}</p>
            <ul className="mt-1 grid gap-0.5 text-sm">
              {compat.motivos.slice(0, 2).map((x) => (
                <li key={x} className="flex items-center gap-1.5 text-success">
                  <CircleCheck className="size-4 shrink-0" aria-hidden="true" /> {x}
                </li>
              ))}
              {compat.alertas.slice(0, 2).map((x) => (
                <li key={x} className="flex items-center gap-1.5 text-review">
                  <CircleHelp className="size-4 shrink-0" aria-hidden="true" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Link href="/guia#test" className="panel-marca group flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
          <span className="icono-modal">
            <Compass className="size-6" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block font-bold">¿Es para vos?</span>
            <span className="block text-sm text-ink-2">Hacé el test de 1 minuto y te mostramos tu compatibilidad con {m.nombre}.</span>
          </span>
        </Link>
      )}

      <div className="hidden gap-3 lg:grid">
        {solicitud ? (
          <Link href={`/mis-solicitudes#${solicitud.id}`} className="btn btn-secundario btn-lg btn-bloque">
            <ShieldCheck className="size-5" aria-hidden="true" /> Ya enviaste una solicitud · Ver estado
          </Link>
        ) : (
          <Link
            href={`/adoptar/${m.id}`}
            className="btn btn-primario btn-lg btn-bloque"
            aria-disabled={m.estado === "reservado"}
            onClick={(e) => m.estado === "reservado" && e.preventDefault()}
          >
            <Heart className="size-5" aria-hidden="true" /> {ella ? "Quiero adoptarla" : "Quiero adoptarlo"}
          </Link>
        )}
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <AgendarVisita m={m} visita={visita} />
          <button type="button" className="btn btn-neutro" onClick={compartir} aria-label={`Compartir la ficha de ${m.nombre}`}>
            <Share2 className="size-5" aria-hidden="true" />
          </button>
        </div>
        {m.estado === "reservado" && (
          <p className="alerta alerta-revision text-sm">
            <Clock className="size-5 shrink-0" aria-hidden="true" />
            <span>
              {m.nombre} tiene una solicitud avanzada. Podés guardarlo en favoritos: si no se concreta, te avisamos.
            </span>
          </p>
        )}
      </div>

      <div className="tarjeta flex items-center gap-4 p-4">
        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={refugio.foto} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/refugios/${refugio.id}`} className="enlace">
            {refugio.nombre}
          </Link>
          <p className="text-sm text-ink-2">{refugio.horario}</p>
        </div>
        <a href={`tel:${refugio.telefono.replace(/\s/g, "")}`} className="icon-btn icon-btn-borde" aria-label={`Llamar a ${refugio.nombre}`}>
          <Phone className="size-5" />
        </a>
      </div>

      {/* Barra fija móvil */}
      <div className="barra-cta grid grid-cols-[auto_1fr] gap-3 lg:hidden">
        <BotonFavorito id={m.id} nombre={m.nombre} grande className="!shadow-none ring-1 ring-line" />
        {solicitud ? (
          <Link href={`/mis-solicitudes#${solicitud.id}`} className="btn btn-secundario">
            Ver mi solicitud
          </Link>
        ) : (
          <Link href={`/adoptar/${m.id}`} className="btn btn-primario" aria-disabled={m.estado === "reservado"}>
            <Heart className="size-5" aria-hidden="true" /> {ella ? "Quiero adoptarla" : "Quiero adoptarlo"}
          </Link>
        )}
      </div>
    </div>
  );
}

function AgendarVisita({ m, visita }: { m: Mascota; visita?: { dia: string; hora: string } }) {
  const [abierto, setAbierto] = useState(false);
  const dias = proximosDias(m.refugio);
  const [dia, setDia] = useState(visita?.dia ?? dias[0].iso);
  const [hora, setHora] = useState(visita?.hora ?? AGENDA[m.refugio].horas[0]);
  useLayoutEffect(() => () => setAbierto(false), []);
  const elegido = dias.find((d) => d.iso === dia);

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger className="btn btn-secundario">
        <CalendarCheck className="size-5" aria-hidden="true" />
        {visita ? `Visita: ${dias.find((d) => d.iso === visita.dia)?.etiqueta ?? visita.dia} ${visita.hora}` : "Agendar una visita"}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="icono-modal">
              <CalendarCheck className="size-6" aria-hidden="true" />
            </span>
            <div>
              <Dialog.Title className="t-h3">Conocé a {m.nombre} en persona</Dialog.Title>
              <Dialog.Description className="mt-1 text-ink-2">
                {REFUGIOS[m.refugio].horarioLargo}. Elegí un día y un horario.
              </Dialog.Description>
            </div>
          </div>
          <fieldset className="mt-6">
            <legend className="mb-3 font-semibold">Día</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {dias.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setDia(d.iso)}
                  aria-pressed={dia === d.iso}
                  className={cn(
                    "grid place-items-center rounded-xl border px-2 py-3 transition-colors",
                    dia === d.iso ? "border-brand bg-accent text-white" : "border-line-input hover:border-ink",
                  )}
                >
                  <span className="text-xs font-semibold uppercase">{d.dia}</span>
                  <span className="text-xl font-bold">{d.num}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="mb-3 font-semibold">Horario</legend>
            <div className="flex flex-wrap gap-2">
              {AGENDA[m.refugio].horas.map((h) => (
                <button key={h} type="button" className="chip sin-pildora" aria-pressed={hora === h} onClick={() => setHora(h)}>
                  {h} h
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close className="btn btn-neutro">Cancelar</Dialog.Close>
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => {
                acciones.agendarVisita({ mascota: m.id, dia, hora });
                setAbierto(false);
                toast.success(`Visita agendada: ${elegido?.etiqueta} a las ${hora} h`, {
                  description: `${REFUGIOS[m.refugio].nombre} te confirma por WhatsApp.`,
                });
              }}
            >
              Confirmar visita
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ Pestañas */
function Contenido({ valor, children }: { valor: string; children: React.ReactNode }) {
  return (
    <Tabs.Content value={valor} className="mt-8 focus-visible:outline-offset-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
        {children}
      </motion.div>
    </Tabs.Content>
  );
}

function Valor({ v, texto }: { v: Convivencia; texto: string }) {
  if (v === true)
    return (
      <span className="si flex items-center gap-1.5">
        <CircleCheck className="size-5" aria-hidden="true" /> Sí, {texto}
      </span>
    );
  if (v === false)
    return (
      <span className="no flex items-center gap-1.5">
        <CircleX className="size-5" aria-hidden="true" /> No
      </span>
    );
  return (
    <span className="quizas flex items-center gap-1.5">
      <CircleHelp className="size-5" aria-hidden="true" /> Todavía no se probó
    </span>
  );
}

export function PestanasFicha({ m }: { m: Mascota }) {
  const [tab, setTab] = useState("sobre");
  const refugio = REFUGIOS[m.refugio];
  const costos = costoMensual(m);
  const total = costos.reduce((a, c) => a + c.v, 0);
  const pestanas = [
    { v: "sobre", t: `Sobre ${m.nombre}` },
    { v: "salud", t: "Salud" },
    { v: "convivencia", t: "Convivencia" },
    { v: "costos", t: "Costos" },
    { v: "refugio", t: "Refugio" },
  ];

  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List className="pestanas" aria-label={`Información de ${m.nombre}`}>
        {pestanas.map((p) => (
          <Tabs.Trigger key={p.v} value={p.v} className="pestana">
            {tab === p.v && <motion.span layoutId="ficha-tab" className="pestana-fondo" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            {p.t}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
          <Contenido valor="sobre">
            <h2 className="t-h3">Cómo es {m.nombre}</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-2">{m.temperamento}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Rasgos">
              {m.rasgos.map((r) => (
                <li key={r} className="tag tag-marca">
                  {r}
                </li>
              ))}
            </ul>
          </Contenido>
          <Contenido valor="salud">
            <h2 className="t-h3">Salud</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-2">{m.saludTexto}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {m.salud.map((s) => (
                <li key={s} className="flex items-center gap-3 rounded-2xl border border-line p-4">
                  <span className="grid size-10 place-items-center rounded-full bg-success-bg text-success">
                    <Syringe className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
              {!m.castrado && (
                <li className="flex items-center gap-3 rounded-2xl border border-line p-4">
                  <span className="grid size-10 place-items-center rounded-full bg-review-bg text-review">
                    <Clock className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold">Castración incluida en la adopción</span>
                </li>
              )}
            </ul>
          </Contenido>
          <Contenido valor="convivencia">
            <h2 className="t-h3">¿Con quién se lleva bien?</h2>
            <p className="mt-2 text-ink-2">Lo que observó el refugio. &quot;Todavía no se probó&quot; no significa que no pueda: se puede presentar de a poco.</p>
            <div className="tabla-wrap mt-6">
              <table className="tabla">
                <caption className="sr-only">Convivencia de {m.nombre}</caption>
                <tbody>
                  <tr>
                    <th scope="row">
                      <span className="flex items-center gap-2">
                        <Dog className="size-5" aria-hidden="true" /> Perros
                      </span>
                    </th>
                    <td>
                      <Valor v={m.convive.perros} texto="convive con perros" />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <span className="flex items-center gap-2">
                        <Cat className="size-5" aria-hidden="true" /> Gatos
                      </span>
                    </th>
                    <td>
                      <Valor v={m.convive.gatos} texto="convive con gatos" />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <span className="flex items-center gap-2">
                        <Baby className="size-5" aria-hidden="true" /> Chicos
                      </span>
                    </th>
                    <td>
                      <Valor v={m.convive.chicos} texto="es bueno con chicos" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Contenido>
          <Contenido valor="costos">
            <h2 className="t-h3">¿Cuánto cuesta por mes?</h2>
            <p className="mt-2 text-ink-2">Un estimado para {m.nombre} según su especie y tamaño. Adoptar es gratis; esto es lo que necesita para estar bien.</p>
            <div className="tarjeta-corte mt-6 max-w-xl p-6">
              <ul className="grid gap-3">
                {costos.map((c) => (
                  <li key={c.t} className="flex items-center justify-between gap-4 border-b border-dashed border-line pb-3">
                    <span className="text-ink-2">{c.t}</span>
                    <span className="font-semibold tabular-nums">{pesos(c.v)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center justify-between text-lg">
                <span className="font-bold">Total estimado</span>
                <span className="text-2xl font-bold text-brand tabular-nums">{pesos(total)}</span>
              </p>
              <Link href="/guia#costos" className="enlace mt-4 inline-block">
                Personalizar en la calculadora
              </Link>
            </div>
          </Contenido>
          <Contenido valor="refugio">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="t-h3">{refugio.nombre}</h2>
                <p className="mt-2 text-ink-2">{refugio.descripcion}</p>
                <ul className="mt-5 grid gap-2.5">
                  <li className="flex items-center gap-2.5">
                    <MapPin className="size-5 text-brand" aria-hidden="true" /> {refugio.barrio}, Río Cuarto
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock className="size-5 text-brand" aria-hidden="true" /> {refugio.horarioLargo}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="size-5 text-brand" aria-hidden="true" /> {refugio.telefono}
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    className="btn btn-secundario"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${refugio.coordenadas.join(",")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="size-4" aria-hidden="true" /> Cómo llegar
                  </a>
                  <Link className="btn btn-fantasma" href={`/refugios/${refugio.id}`}>
                    Ver todos sus animales
                  </Link>
                </div>
              </div>
              <MapaRefugios solo={refugio.id} className="h-72" mostrarYo={false} />
            </div>
          </Contenido>
    </Tabs.Root>
  );
}
