"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useLayoutEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CircleAlert, MapPin, Megaphone, Phone, Search, Share2, X } from "lucide-react";
import type { ReportePerdido } from "@/types";
import { PERDIDOS_SEMILLA } from "@/data/perdidos";
import { BARRIOS } from "@/data/barrios";
import { acciones, useEstado } from "@/lib/store";
import { cn, haceCuanto } from "@/lib/utils";
import { Huella, IconoWhatsapp } from "@/components/ui/Marca";
import { seguirCursor } from "@/components/mascotas/TarjetaMascota";

type Filtro = "todos" | "perdido" | "encontrado";

export function Perdidos() {
  const { reportes } = useEstado();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [especie, setEspecie] = useState<"" | "perro" | "gato">("");
  const [barrio, setBarrio] = useState("");
  const propios = new Set(reportes.map((r) => r.id));
  const todos = [...reportes, ...PERDIDOS_SEMILLA];
  const lista = todos
    .filter((r) => (filtro === "todos" || r.tipo === filtro) && (!especie || r.especie === especie) && (!barrio || r.barrio === barrio))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="pestanas" role="group" aria-label="Tipo de reporte">
          {(
            [
              { v: "todos", t: "Todos" },
              { v: "perdido", t: "Se perdieron" },
              { v: "encontrado", t: "Encontrados" },
            ] as const
          ).map((o) => (
            <button key={o.v} type="button" className="pestana" aria-pressed={filtro === o.v} onClick={() => setFiltro(o.v)}>
              {filtro === o.v && <motion.span layoutId="perd-tab" className="pestana-fondo" />}
              <span className={cn(filtro === o.v && "text-brand")}>{o.t}</span>
              <span className="cuenta">{o.v === "todos" ? todos.length : todos.filter((r) => r.tipo === o.v).length}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <label className="sr-only" htmlFor="perd-esp">
            Especie
          </label>
          <select id="perd-esp" className="select !min-h-11 !w-auto !rounded-full !py-2" value={especie} onChange={(e) => setEspecie(e.target.value as typeof especie)}>
            <option value="">Perros y gatos</option>
            <option value="perro">Perros</option>
            <option value="gato">Gatos</option>
          </select>
          <label className="sr-only" htmlFor="perd-barrio">
            Barrio
          </label>
          <select id="perd-barrio" className="select !min-h-11 !w-auto !rounded-full !py-2" value={barrio} onChange={(e) => setBarrio(e.target.value)}>
            <option value="">Todos los barrios</option>
            {BARRIOS.filter((b) => b !== "Otro").map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <Reportar />
        </div>
      </div>

      <p className="mt-6 font-semibold" aria-live="polite">
        {lista.length === 1 ? "1 reporte" : `${lista.length} reportes`}
      </p>

      <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {lista.map((r) => (
            <motion.li key={r.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <TarjetaReporte r={r} propio={propios.has(r.id)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {!lista.length && (
        <div className="vacio">
          <span className="vacio-icono">
            <Search className="size-10" aria-hidden="true" />
          </span>
          <h2 className="t-h3">No hay reportes con esos filtros</h2>
          <p className="text-ink-2">Probá con otro barrio o reportá vos.</p>
        </div>
      )}
    </div>
  );
}

function TarjetaReporte({ r, propio }: { r: ReportePerdido; propio: boolean }) {
  const perdido = r.tipo === "perdido";
  const compartir = async () => {
    const texto = `${perdido ? "Se busca" : "Encontrado"}: ${r.nombre !== "Sin nombre" ? r.nombre + ", " : ""}${r.descripcion} Zona ${r.barrio}. Tel ${r.telefono}`;
    try {
      if (navigator.share) await navigator.share({ title: "AdoptApp · Perdidos y encontrados", text: texto });
      else {
        await navigator.clipboard.writeText(texto);
        toast.success("Copiamos el texto para compartir");
      }
    } catch {
      /* cancelado */
    }
  };
  return (
    <article className="tarjeta-mascota con-reflejo group" onPointerMove={seguirCursor}>
      <div className="media">
        {r.foto ? (
          <Image src={r.foto} alt={r.alt} fill sizes="(min-width:1024px) 25vw, 90vw" />
        ) : (
          <div className="grid size-full place-items-center bg-accent-soft text-brand">
            <Huella className="size-16 opacity-60" />
          </div>
        )}
        <div className="insignias">
          <span className={cn("insignia flex items-center gap-1", perdido ? "!bg-danger !text-white" : "!bg-success !text-white")}>
            {perdido ? <CircleAlert className="size-3.5" aria-hidden="true" /> : <Search className="size-3.5" aria-hidden="true" />}
            {perdido ? "Se busca" : "Encontrado"}
          </span>
          {propio && <span className="insignia">Tu reporte</span>}
        </div>
      </div>
      <span className="reflejo" aria-hidden="true" />
      <div className="relative z-[2] flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="t-h4">{r.nombre}</h3>
          <span className="shrink-0 text-sm text-ink-2">{haceCuanto(r.fecha)}</span>
        </div>
        <p className="flex items-center gap-1.5 text-[0.9375rem] text-ink-2">
          <MapPin className="size-4 text-brand" aria-hidden="true" /> {r.barrio}
        </p>
        <p className="text-[0.9375rem]">{r.descripcion}</p>
        <div className="mt-auto flex gap-2 pt-3">
          <a href={`tel:${r.telefono.replace(/\s/g, "")}`} className="btn btn-primario btn-sm flex-1">
            <Phone className="size-4" aria-hidden="true" /> Llamar
          </a>
          <a href={`https://wa.me/54${r.telefono.replace(/\s/g, "")}`} target="_blank" rel="noreferrer" className="icon-btn icon-btn-borde" aria-label={`Escribir por WhatsApp sobre ${r.nombre}`}>
            <IconoWhatsapp className="size-5" />
          </a>
          <button type="button" className="icon-btn icon-btn-borde" onClick={compartir} aria-label={`Compartir el reporte de ${r.nombre}`}>
            <Share2 className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Reportar() {
  const [abierto, setAbierto] = useState(false);
  const [tipo, setTipo] = useState<"perdido" | "encontrado">("perdido");
  const [errores, setErrores] = useState<Record<string, string>>({});
  useLayoutEffect(() => () => setAbierto(false), []);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (!v("especie")) err.especie = "Elegí perro o gato.";
    if (!v("barrio")) err.barrio = "Elegí el barrio.";
    if (v("descripcion").length < 15) err.descripcion = "Describilo un poco más: color, collar, señas.";
    if (!/^[\d\s+()-]{8,}$/.test(v("telefono"))) err.telefono = "Escribí un teléfono con característica.";
    setErrores(err);
    if (Object.keys(err).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(err)[0]}"]`)?.focus();
      return;
    }
    acciones.reportar({
      tipo,
      especie: v("especie") as "perro" | "gato",
      nombre: v("nombre") || "Sin nombre",
      barrio: v("barrio"),
      foto: "",
      alt: "",
      descripcion: v("descripcion"),
      telefono: v("telefono"),
    });
    setAbierto(false);
    toast.success("Publicamos tu reporte", { description: "Compartilo en tus redes: cuanto más se mueve, mejor." });
  };

  const err = (k: string) =>
    errores[k] ? (
      <p id={`rep-${k}-error`} className="error-campo">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {errores[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": errores[k] ? true : undefined, "aria-describedby": errores[k] ? `rep-${k}-error` : undefined });

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger className="btn btn-primario btn-sm !rounded-full">
        <Megaphone className="size-4" aria-hidden="true" /> Reportar
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg-hoja">
          <div className="agarradera" aria-hidden="true" />
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <Dialog.Title className="t-h3">Nuevo reporte</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label="Cerrar">
              <X className="size-6" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Reportá un animal perdido o encontrado en Río Cuarto.</Dialog.Description>
          <form onSubmit={enviar} noValidate className="grid flex-1 content-start gap-5 overflow-y-auto px-6 py-6">
            <div className="segmentado !bg-surface" role="radiogroup" aria-label="Tipo">
              {(["perdido", "encontrado"] as const).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tipo === t} onClick={() => setTipo(t)} className="!text-ink">
                  {tipo === t && <motion.span layoutId="rep-tipo" className="segmento-fondo !bg-accent" />}
                  <span className={cn(tipo === t && "text-white")}>{t === "perdido" ? "Se me perdió" : "Lo encontré"}</span>
                </button>
              ))}
            </div>
            <fieldset>
              <legend className="etiqueta mb-2">Especie</legend>
              <div className="grid grid-cols-2 gap-2">
                {["perro", "gato"].map((x) => (
                  <label key={x} className="opcion">
                    <input type="radio" name="especie" value={x} {...aria("especie")} />
                    <span className="opcion-caja !min-h-12 capitalize">
                      {x}
                      <span className="opcion-marca" aria-hidden="true" />
                    </span>
                  </label>
                ))}
              </div>
              {err("especie")}
            </fieldset>
            <div className="campo">
              <label htmlFor="rep-nombre" className="etiqueta">
                Nombre <span className="opcional">(si lo sabés)</span>
              </label>
              <input id="rep-nombre" name="nombre" className="input" />
            </div>
            <div className="campo">
              <label htmlFor="rep-barrio" className="etiqueta">
                Barrio donde {tipo === "perdido" ? "se perdió" : "lo encontraste"}
              </label>
              <select id="rep-barrio" name="barrio" className="select" defaultValue="" {...aria("barrio")}>
                <option value="">Elegí el barrio</option>
                {BARRIOS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {err("barrio")}
            </div>
            <div className="campo">
              <label htmlFor="rep-desc" className="etiqueta">
                Descripción
              </label>
              <textarea id="rep-desc" name="descripcion" className="textarea !min-h-24" placeholder="Color, tamaño, collar, si tiene chip…" {...aria("descripcion")} />
              {err("descripcion")}
            </div>
            <div className="campo">
              <label htmlFor="rep-tel" className="etiqueta">
                Teléfono de contacto
              </label>
              <input id="rep-tel" name="telefono" type="tel" inputMode="tel" autoComplete="tel" className="input" placeholder="358 412 3456" {...aria("telefono")} />
              {err("telefono")}
            </div>
            <button type="submit" className="btn btn-primario btn-lg mt-2">
              Publicar reporte
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
