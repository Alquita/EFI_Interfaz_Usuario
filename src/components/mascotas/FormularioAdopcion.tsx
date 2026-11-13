"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CircleCheck,
  ClipboardList,
  Home,
  LogIn,
  MessageCircle,
  PawPrint,
  Pencil,
  Send,
  Trees,
} from "lucide-react";
import type { Mascota } from "@/types";
import { BARRIOS } from "@/data/barrios";
import { REFUGIOS } from "@/data/refugios";
import { acciones, useEstado } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ariaCampo, Campo, MensajeError } from "@/components/ui/Formulario";
import { Confeti } from "@/components/ui/Confeti";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

const esquema = z
  .object({
    nombre: z.string().trim().min(3, "Escribí tu nombre y apellido."),
    telefono: z
      .string()
      .trim()
      .regex(/^[\d\s+()-]{8,}$/, "Escribí un teléfono con característica, por ejemplo 358 412 3456."),
    correo: z.string().trim().email("Escribí un correo válido, por ejemplo nombre@correo.com."),
    barrio: z.string().min(1, "Elegí tu barrio."),
    vivienda: z.string().min(1, "Contanos dónde vivís."),
    otras: z.enum(["No", "Sí"], { error: "Elegí una opción." }),
    otrasCuales: z.string().optional(),
    acuerdo: z.boolean().refine((v) => v, "Es necesario que todas las personas de la casa estén de acuerdo."),
    rutina: z.string().trim().min(30, "Contanos un poco más (mínimo 30 caracteres).").max(500),
    seguimiento: z.boolean().refine((v) => v, "Para adoptar hay que aceptar el seguimiento del refugio."),
  })
  .refine((d) => d.otras === "No" || (d.otrasCuales ?? "").trim().length > 2, {
    path: ["otrasCuales"],
    message: "Contanos qué animales tenés.",
  });

type Datos = z.infer<typeof esquema>;

const PASOS = [
  { titulo: "Tus datos", campos: ["nombre", "telefono", "correo", "barrio"] as const },
  { titulo: "Tu hogar", campos: ["vivienda", "otras", "otrasCuales", "acuerdo", "rutina"] as const },
  { titulo: "Confirmar", campos: ["seguimiento"] as const },
];

const VIVIENDAS = [
  { v: "Departamento", i: Building2, s: "Con o sin balcón" },
  { v: "Casa sin patio", i: Home, s: "Con espacios cerrados" },
  { v: "Casa con patio", i: Trees, s: "Patio o jardín cerrado" },
];

export function FormularioAdopcion({ m }: { m: Mascota }) {
  const { usuario } = useEstado();
  const [paso, setPaso] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const [enviado, setEnviado] = useState<string | null>(null);
  const reducido = useMovimientoReducido();
  const titulo = useRef<HTMLHeadingElement>(null);
  const ella = m.sexo === "hembra";

  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      correo: usuario?.correo ?? "",
      telefono: "",
      barrio: usuario?.barrio ?? "",
      vivienda: "",
      otras: undefined,
      otrasCuales: "",
      acuerdo: false,
      rutina: "",
      seguimiento: false,
    },
  });

  const otras = useWatch({ control, name: "otras" });
  const rutina = useWatch({ control, name: "rutina" }) ?? "";

  const enfocarTitulo = () => requestAnimationFrame(() => titulo.current?.focus());

  const siguiente = async () => {
    const ok = await trigger([...PASOS[paso].campos], { shouldFocus: true });
    if (!ok) return;
    setDireccion(1);
    setPaso((p) => p + 1);
    enfocarTitulo();
    window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
  };

  const anterior = (destino = paso - 1) => {
    setDireccion(-1);
    setPaso(destino);
    enfocarTitulo();
  };

  const enviar = async (d: Datos) => {
    await new Promise((r) => setTimeout(r, 900));
    const id = acciones.enviarSolicitud(m.id, m.nombre, {
      nombre: d.nombre,
      telefono: d.telefono,
      correo: d.correo,
      barrio: d.barrio,
      vivienda: d.vivienda,
      otras: d.otras === "Sí" ? `Sí: ${d.otrasCuales}` : "No",
      acuerdo: d.acuerdo,
      rutina: d.rutina,
      seguimiento: d.seguimiento,
    });
    setEnviado(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (!usuario) {
    return (
      <div className="tarjeta mx-auto max-w-xl p-8 text-center">
        <span className="vacio-icono mx-auto">
          <LogIn className="size-9" aria-hidden="true" />
        </span>
        <h1 className="t-h2 mt-4">Ingresá para adoptar a {m.nombre}</h1>
        <p className="mt-3 text-ink-2">Así podés seguir el estado de tu solicitud y recibir los mensajes del refugio.</p>
        <Link href={`/ingresar?volver=/adoptar/${m.id}`} className="btn btn-primario btn-lg mt-6">
          Ingresar o crear cuenta
        </Link>
      </div>
    );
  }

  if (enviado) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl text-center">
        {!reducido && <Confeti />}
        <div className="relative mx-auto size-36">
          <div className="relative size-full overflow-hidden rounded-full border-4 border-card shadow-e3">
            <Image src={m.foto} alt={m.alt} fill sizes="144px" className="object-cover" />
          </div>
          <motion.span
            className="absolute -bottom-1 -right-1 grid size-12 place-items-center rounded-full bg-success text-white shadow-e2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3, stiffness: 400, damping: 14 }}
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" className="trazo-dibujado" style={{ ["--largo" as string]: 24, ["--retraso" as string]: "450ms" }} />
            </svg>
          </motion.span>
        </div>
        <h1 className="t-h1 mt-8" tabIndex={-1}>
          ¡Solicitud enviada!
        </h1>
        <p className="t-lead mx-auto mt-3 max-w-lg">
          {REFUGIOS[m.refugio].nombre} va a leer tu solicitud por {m.nombre} en las próximas 48 h hábiles. Te avisamos por
          notificación y correo.
        </p>
        <ol className="mx-auto mt-10 grid max-w-xl gap-3 text-left">
          {[
            { t: "En revisión", s: "El refugio lee tu solicitud.", hecho: true },
            { t: "Llamada o mensaje", s: "Te contactan para conocerte y responder dudas." },
            { t: "Encuentro", s: `Conocés a ${m.nombre} en persona.` },
            { t: "¡A casa!", s: "Firmás el acuerdo de adopción y empieza el seguimiento." },
          ].map((x, i) => (
            <motion.li
              key={x.t}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={cn("flex items-center gap-4 rounded-2xl border p-4", x.hecho ? "border-review bg-review-bg" : "border-line")}
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full font-bold", x.hecho ? "bg-review text-white" : "bg-surface")}>
                {i + 1}
              </span>
              <span>
                <span className="block font-semibold">{x.t}</span>
                <span className="text-sm text-ink-2">{x.s}</span>
              </span>
            </motion.li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={`/mis-solicitudes#${enviado}`} className="btn btn-primario btn-lg">
            <ClipboardList className="size-5" aria-hidden="true" /> Ver mis solicitudes
          </Link>
          <Link href="/guia#primeros-dias" className="btn btn-secundario btn-lg">
            Preparar la casa
          </Link>
        </div>
      </motion.div>
    );
  }

  const valores = getValues();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <form onSubmit={handleSubmit(enviar)} noValidate className="tarjeta p-6 md:p-10">
        <ol className="pasos" aria-label="Pasos de la solicitud">
          {PASOS.map((p, i) => (
            <li key={p.titulo} data-estado={i < paso ? "hecho" : i === paso ? "actual" : "pendiente"} aria-current={i === paso ? "step" : undefined}>
              <span className="barra-paso">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-accent"
                  initial={false}
                  animate={{ scaleX: i < paso ? 1 : i === paso ? 0.5 : 0 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </span>
              <span className="flex items-center gap-1.5">
                {i < paso ? <CircleCheck className="size-4 text-success" aria-hidden="true" /> : <span className="tabular-nums">{i + 1}.</span>}
                {p.titulo}
                <span className="sr-only">{i < paso ? " (completo)" : i === paso ? " (paso actual)" : ""}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="relative mt-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direccion} initial={false}>
            <motion.fieldset
              key={paso}
              custom={direccion}
              initial={{ opacity: 0, x: direccion * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direccion * -40 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="grid gap-6"
            >
              <legend className="contents">
                <h2 ref={titulo} tabIndex={-1} className="t-h2 outline-none">
                  {paso === 0 && "Contanos quién sos"}
                  {paso === 1 && `¿Cómo sería la vida de ${m.nombre} con vos?`}
                  {paso === 2 && "Revisá y enviá"}
                </h2>
              </legend>

              {paso === 0 && (
                <>
                  <p className="-mt-3 text-ink-2">El refugio usa estos datos solo para contactarte por esta adopción.</p>
                  <Campo id="nombre" etiqueta="Nombre y apellido" error={errors.nombre?.message}>
                    <input className="input" autoComplete="name" {...ariaCampo("nombre", errors.nombre?.message)} {...register("nombre")} />
                  </Campo>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Campo id="telefono" etiqueta="Teléfono" ayuda="Preferimos WhatsApp." error={errors.telefono?.message}>
                      <input
                        className="input"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="358 412 3456"
                        {...ariaCampo("telefono", errors.telefono?.message, true)}
                        {...register("telefono")}
                      />
                    </Campo>
                    <Campo id="correo" etiqueta="Correo" error={errors.correo?.message}>
                      <input className="input" type="email" autoComplete="email" {...ariaCampo("correo", errors.correo?.message)} {...register("correo")} />
                    </Campo>
                  </div>
                  <Campo id="barrio" etiqueta="Barrio" error={errors.barrio?.message}>
                    <select className="select" {...ariaCampo("barrio", errors.barrio?.message)} {...register("barrio")}>
                      <option value="">Elegí tu barrio</option>
                      {BARRIOS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Campo>
                </>
              )}

              {paso === 1 && (
                <>
                  <fieldset>
                    <legend className="etiqueta mb-3">¿Dónde vivís?</legend>
                    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
                      {VIVIENDAS.map((v) => (
                        <label key={v.v} className="opcion">
                          <input type="radio" value={v.v} {...register("vivienda")} />
                          <span className="opcion-caja !flex-col !items-start !gap-2 !py-4">
                            <v.i className="size-6" aria-hidden="true" />
                            <span>
                              <span className="block font-semibold">{v.v}</span>
                              <span className="text-sm text-ink-2">{v.s}</span>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <MensajeError id="vivienda" error={errors.vivienda?.message} />
                  </fieldset>

                  <fieldset>
                    <legend className="etiqueta mb-3">¿Convivís con otros animales?</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["No", "Sí"].map((o) => (
                        <label key={o} className="opcion">
                          <input type="radio" value={o} {...register("otras")} />
                          <span className="opcion-caja">
                            {o === "Sí" ? <PawPrint className="size-5" aria-hidden="true" /> : null}
                            {o === "Sí" ? "Sí, tengo" : "No, sería el único"}
                            <span className="opcion-marca" aria-hidden="true" />
                          </span>
                        </label>
                      ))}
                    </div>
                    <MensajeError id="otras" error={errors.otras?.message} />
                    <AnimatePresence initial={false}>
                      {otras === "Sí" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <Campo id="otrasCuales" etiqueta="¿Cuáles? ¿Están castrados?" error={errors.otrasCuales?.message} className="pt-4">
                            <input
                              className="input"
                              placeholder="Ej.: una gata de 4 años, castrada"
                              {...ariaCampo("otrasCuales", errors.otrasCuales?.message)}
                              {...register("otrasCuales")}
                            />
                          </Campo>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </fieldset>

                  <Campo
                    id="rutina"
                    etiqueta={`¿Cómo sería un día de ${m.nombre} con vos?`}
                    ayuda="Horarios, paseos, quién lo cuida cuando no estás. No hay respuestas incorrectas."
                    error={errors.rutina?.message}
                    extra={
                      <span className={cn("contador", rutina.length > 0 && rutina.length < 30 && "!text-review")} aria-live="polite">
                        {rutina.length}/500
                      </span>
                    }
                  >
                    <textarea className="textarea" maxLength={500} {...ariaCampo("rutina", errors.rutina?.message, true)} {...register("rutina")} />
                  </Campo>

                  <div>
                    <label className="opcion">
                      <input type="checkbox" {...register("acuerdo")} aria-describedby={errors.acuerdo ? "acuerdo-error" : undefined} />
                      <span className="opcion-caja">
                        Todas las personas de la casa están de acuerdo con la adopción
                        <span className="opcion-marca cuadrada" aria-hidden="true" />
                      </span>
                    </label>
                    <MensajeError id="acuerdo" error={errors.acuerdo?.message} />
                  </div>
                </>
              )}

              {paso === 2 && (
                <>
                  <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
                    {[
                      { t: "Nombre", v: valores.nombre, p: 0 },
                      { t: "Teléfono", v: valores.telefono, p: 0 },
                      { t: "Correo", v: valores.correo, p: 0 },
                      { t: "Barrio", v: valores.barrio, p: 0 },
                      { t: "Vivienda", v: valores.vivienda, p: 1 },
                      { t: "Otros animales", v: valores.otras === "Sí" ? `Sí: ${valores.otrasCuales}` : "No", p: 1 },
                      { t: "Un día juntos", v: valores.rutina, p: 1 },
                    ].map((f) => (
                      <div key={f.t} className="grid grid-cols-[8rem_1fr_auto] items-start gap-3 bg-card p-4 sm:grid-cols-[10rem_1fr_auto]">
                        <dt className="text-ink-2">{f.t}</dt>
                        <dd className="min-w-0 break-words font-medium">{f.v}</dd>
                        <button type="button" className="icon-btn -my-2 size-9" onClick={() => anterior(f.p)} aria-label={`Editar ${f.t.toLowerCase()}`}>
                          <Pencil className="size-4" />
                        </button>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <label className="opcion">
                      <input type="checkbox" {...register("seguimiento")} aria-describedby={errors.seguimiento ? "seguimiento-error" : undefined} />
                      <span className="opcion-caja">
                        <span>
                          <span className="block font-semibold">Acepto el seguimiento del refugio</span>
                          <span className="text-sm text-ink-2">Una llamada o visita durante los primeros meses para acompañarte.</span>
                        </span>
                        <span className="opcion-marca cuadrada" aria-hidden="true" />
                      </span>
                    </label>
                    <MensajeError id="seguimiento" error={errors.seguimiento?.message} />
                  </div>
                  <p className="alerta alerta-info text-[0.9375rem]">
                    <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
                    <span>Adoptar es gratis. El refugio nunca te va a pedir dinero por adelantado para reservar a {m.nombre}.</span>
                  </p>
                </>
              )}
            </motion.fieldset>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          {paso > 0 ? (
            <button type="button" className="btn btn-neutro" onClick={() => anterior()}>
              <ArrowLeft className="size-5" aria-hidden="true" /> Anterior
            </button>
          ) : (
            <Link href={`/mascota/${m.id}`} className="btn btn-fantasma">
              Volver a la ficha
            </Link>
          )}
          {paso < PASOS.length - 1 ? (
            <button type="button" className="btn btn-primario" onClick={siguiente}>
              Siguiente: {PASOS[paso + 1].titulo} <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-primario" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Enviando…
                </>
              ) : (
                <>
                  <Send className="size-5" aria-hidden="true" /> Enviar solicitud
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <aside className="tarjeta overflow-hidden lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" aria-label={`Resumen de ${m.nombre}`}>
        <div className="relative aspect-[4/3]">
          <Image src={m.foto} alt={m.alt} fill sizes="22rem" className="object-cover" />
        </div>
        <div className="p-5">
          <p className="t-eyebrow !text-xs">Solicitud de adopción</p>
          <p className="t-h3 mt-1">{m.nombre}</p>
          <p className="text-ink-2">
            {m.tipo} · {m.edad} · {m.barrio}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {m.salud.slice(0, 3).map((s) => (
              <li key={s} className="tag tag-suave !min-h-8 text-sm">
                <CircleCheck className="size-4 text-success" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-sm text-ink-2">
            Responde: <strong className="text-ink">{REFUGIOS[m.refugio].nombre}</strong> en 48 h hábiles. {ella ? "Ella" : "Él"} ya está
            {m.castrado ? (ella ? " castrada" : " castrado") : " por castrarse"} y con sus vacunas.
          </p>
        </div>
      </aside>
    </div>
  );
}
