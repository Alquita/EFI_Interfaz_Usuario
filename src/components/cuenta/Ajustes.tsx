"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { motion } from "motion/react";
import { useLayoutEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { Bell, Check, Contrast, Laptop, Moon, RotateCcw, Sun, Type, Wind } from "lucide-react";
import type { Ajustes as TAjustes } from "@/types";
import { acciones, useEstado, type Tema } from "@/lib/store";
import { cn } from "@/lib/utils";
import { cambiarTemaAnimado } from "@/components/sitio/BotonTema";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

function Fila({
  id,
  titulo,
  sub,
  icono: Icono,
  valor,
  onCambio,
}: {
  id: string;
  titulo: string;
  sub: string;
  icono: typeof Bell;
  valor: boolean;
  onCambio: (v: boolean) => void;
}) {
  return (
    <div className="fila-switch px-5">
      <span className="icono-menu">
        <Icono className="size-5" aria-hidden="true" />
      </span>
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <span className="block font-semibold">{titulo}</span>
        <span className="ayuda block">{sub}</span>
      </label>
      <Switch.Root id={id} className="switch" checked={valor} onCheckedChange={onCambio}>
        <Switch.Thumb className="switch-thumb">
          <Check className="size-3.5" strokeWidth={3} />
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
}

const TEMAS: { v: Tema; t: string; i: typeof Sun }[] = [
  { v: "claro", t: "Claro", i: Sun },
  { v: "oscuro", t: "Oscuro", i: Moon },
  { v: "sistema", t: "Como el sistema", i: Laptop },
];

export function Ajustes() {
  const { ajustes, tema } = useEstado();
  const reducido = useMovimientoReducido();
  const cambiar = <K extends keyof TAjustes>(k: K, v: TAjustes[K], msj: string) => {
    acciones.cambiarAjuste(k, v);
    toast.success(msj);
  };

  const elegirTema = (t: Tema, e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const origen = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (t === "sistema") {
      acciones.cambiarTema("sistema");
      return;
    }
    cambiarTemaAnimado(t === "oscuro", origen, reducido);
  };

  return (
    <div className="mx-auto grid max-w-3xl gap-10">
      <section aria-labelledby="t-apariencia">
        <h2 id="t-apariencia" className="t-h3 flex items-center gap-2">
          <Contrast className="size-6 text-brand" aria-hidden="true" /> Apariencia
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Tema">
          {TEMAS.map((x) => {
            const activo = tema === x.v;
            return (
              <button
                key={x.v}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={(e) => elegirTema(x.v, e)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-colors",
                  activo ? "border-brand" : "border-line hover:border-ink-2",
                )}
              >
                <span
                  className={cn(
                    "block aspect-[16/10] overflow-hidden rounded-xl border border-line p-3",
                    x.v === "claro" && "bg-white",
                    x.v === "oscuro" && "bg-black",
                    x.v === "sistema" && "bg-gradient-to-r from-white from-50% to-black to-50%",
                  )}
                  aria-hidden="true"
                >
                  <span className="block h-2.5 w-1/2 rounded-full bg-[#c2410c]" />
                  <span className={cn("mt-2 block h-2 w-4/5 rounded-full", x.v === "oscuro" ? "bg-[#2e2e2e]" : "bg-[#d4d4d4]")} />
                  <span className={cn("mt-1.5 block h-2 w-3/5 rounded-full", x.v === "oscuro" ? "bg-[#2e2e2e]" : "bg-[#d4d4d4]")} />
                  <span className="mt-3 flex gap-1.5">
                    <span className="h-6 w-10 rounded-md bg-[#f97316]" />
                    <span className={cn("h-6 w-10 rounded-md", x.v === "oscuro" ? "bg-[#1f1f1f]" : "bg-[#ebebeb]")} />
                  </span>
                </span>
                <span className="mt-3 flex items-center gap-2 font-semibold">
                  <x.i className="size-4" aria-hidden="true" /> {x.t}
                  {activo && (
                    <motion.span layoutId="tema-ok" className="ml-auto grid size-6 place-items-center rounded-full bg-accent text-white">
                      <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="notificaciones" className="scroll-mt" aria-labelledby="t-notif">
        <h2 id="t-notif" className="t-h3 flex items-center gap-2">
          <Bell className="size-6 text-brand" aria-hidden="true" /> Notificaciones
        </h2>
        <div className="grupo-lista mt-5">
          <Fila
            id="aj-sol"
            icono={Bell}
            titulo="Cambios en mis solicitudes"
            sub="Cuando un refugio aprueba, responde o pide datos."
            valor={ajustes.notifSolicitudes}
            onCambio={(v) => cambiar("notifSolicitudes", v, v ? "Te avisamos de tus solicitudes" : "Desactivaste avisos de solicitudes")}
          />
          <Fila
            id="aj-cerca"
            icono={Bell}
            titulo="Mascotas nuevas cerca"
            sub="Cuando llegan mascotas que coinciden con tus filtros."
            valor={ajustes.notifCerca}
            onCambio={(v) => cambiar("notifCerca", v, v ? "Te avisamos cuando lleguen" : "Listo, no te avisamos")}
          />
          <Fila
            id="aj-correo"
            icono={Bell}
            titulo="También por correo"
            sub="Un resumen semanal con novedades de los refugios."
            valor={ajustes.notifCorreo}
            onCambio={(v) => cambiar("notifCorreo", v, v ? "Te vamos a escribir los lunes" : "Desactivaste los correos")}
          />
        </div>
      </section>

      <section aria-labelledby="t-acc">
        <h2 id="t-acc" className="t-h3 flex items-center gap-2">
          <Type className="size-6 text-brand" aria-hidden="true" /> Accesibilidad
        </h2>
        <div className="grupo-lista mt-5">
          <Fila
            id="aj-mov"
            icono={Wind}
            titulo="Reducir movimiento"
            sub="Desactiva carruseles automáticos, parallax y animaciones grandes."
            valor={ajustes.reducirMovimiento}
            onCambio={(v) => cambiar("reducirMovimiento", v, v ? "Reducimos las animaciones" : "Animaciones activadas")}
          />
          <Fila
            id="aj-texto"
            icono={Type}
            titulo="Texto más grande"
            sub="Agranda todo el texto un 25 %."
            valor={ajustes.textoGrande}
            onCambio={(v) => cambiar("textoGrande", v, v ? "Agrandamos el texto" : "Texto en tamaño normal")}
          />
        </div>
        <p className="mt-4 rounded-2xl bg-surface p-5 text-ink-2">
          Vista previa: <span className="font-semibold text-ink">Lola es tranquila en casa y muy cariñosa con las personas.</span>
        </p>
      </section>

      <Reiniciar />
    </div>
  );
}

function Reiniciar() {
  const [abierto, setAbierto] = useState(false);
  useLayoutEffect(() => () => setAbierto(false), []);
  return (
    <section aria-labelledby="t-datos" className="rounded-2xl border border-danger/40 p-6">
      <h2 id="t-datos" className="t-h4">Datos de esta demo</h2>
      <p className="mt-1 text-ink-2">
        AdoptApp guarda favoritos, solicitudes y ajustes solo en este navegador. Podés volver a los datos de ejemplo.
      </p>
      <Dialog.Root open={abierto} onOpenChange={setAbierto}>
        <Dialog.Trigger className="btn btn-peligro btn-sm mt-4">
          <RotateCcw className="size-4" aria-hidden="true" /> Restablecer datos
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dlg-overlay" />
          <Dialog.Content className="dlg p-6 md:p-8" role="alertdialog">
            <Dialog.Title className="t-h3">¿Restablecer todo?</Dialog.Title>
            <Dialog.Description className="mt-2 text-ink-2">
              Se borran tus favoritos, solicitudes nuevas, publicaciones y ajustes, y vuelven los datos de ejemplo.
            </Dialog.Description>
            <div className="mt-8 flex justify-end gap-3">
              <Dialog.Close className="btn btn-neutro">Cancelar</Dialog.Close>
              <button
                type="button"
                className="btn btn-primario"
                onClick={() => {
                  acciones.reiniciarTodo();
                  setAbierto(false);
                  toast.success("Volvimos a los datos de ejemplo");
                }}
              >
                Restablecer
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
