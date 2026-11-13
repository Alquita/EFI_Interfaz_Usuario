"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Accessibility,
  BookOpen,
  CalendarCheck,
  CalendarHeart,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Gift,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Megaphone,
  Pencil,
  Settings,
} from "lucide-react";
import { MASCOTAS } from "@/data/mascotas";
import { EVENTOS } from "@/data/eventos";
import { BARRIOS } from "@/data/barrios";
import { CHECKLIST } from "@/data/guia";
import { REFUGIOS } from "@/data/refugios";
import { acciones, useEstado, useHidratado } from "@/lib/store";
import { fechaCorta, fechaLarga } from "@/lib/utils";
import { Contador } from "@/components/ui/Movimiento";

export function Perfil() {
  const e = useEstado();
  const hidratado = useHidratado();
  const router = useRouter();
  const u = e.usuario;

  if (hidratado && !u) {
    return (
      <div className="vacio">
        <span className="vacio-icono">
          <LogIn className="size-10" aria-hidden="true" />
        </span>
        <h1 className="t-h2">Ingresá a tu cuenta</h1>
        <p className="max-w-md text-ink-2">Guardá favoritos, enviá solicitudes y seguí su estado desde un solo lugar.</p>
        <Link href="/ingresar?volver=/perfil" className="btn btn-primario mt-2">
          Ingresar o crear cuenta
        </Link>
      </div>
    );
  }
  if (!u) return null;

  const iniciales = u.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const enRevision = e.solicitudes.filter((s) => s.estado === "revision").length;
  const progresoChecklist = Math.round((e.checklist.length / CHECKLIST.length) * 100);
  const eventos = EVENTOS.filter((x) => e.recordatorios.includes(x.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      <aside className="grid content-start gap-5">
        <div className="tarjeta relative overflow-hidden p-6 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-accent to-brand-deco" aria-hidden="true">
            <div className="textura-huellas size-full opacity-40 mix-blend-overlay" />
          </div>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="avatar relative mx-auto mt-6 !size-24 border-4 border-card !text-3xl"
          >
            {iniciales}
          </motion.span>
          <h1 className="t-h3 mt-3">{u.nombre}</h1>
          <p className="text-ink-2">{u.correo}</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-2">
            <MapPin className="size-4 text-brand" aria-hidden="true" /> {u.barrio}, Río Cuarto
          </p>
          <EditarPerfil />
        </div>
        <nav aria-label="Cuenta" className="grupo-lista">
          {[
            { href: "/ajustes", t: "Ajustes", s: "Tema, notificaciones y accesibilidad", i: Settings },
            { href: "/accesibilidad", t: "Accesibilidad", s: "Cómo usar AdoptApp a tu manera", i: Accessibility },
            { href: "/ayuda", t: "Ayuda", s: "Preguntas frecuentes", i: CircleHelp },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="fila-lista">
              <span className="icono-menu">
                <x.i className="size-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="font-semibold">{x.t}</span>
                <span className="sub">{x.s}</span>
              </span>
              <ChevronRight className="size-5 text-ink-2" aria-hidden="true" />
            </Link>
          ))}
          <button
            type="button"
            className="fila-lista !text-danger"
            onClick={() => {
              acciones.salir();
              toast("Cerraste sesión");
              router.push("/");
            }}
          >
            <span className="icono-menu !bg-danger-bg !text-danger">
              <LogOut className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">Cerrar sesión</span>
          </button>
        </nav>
      </aside>

      <div className="grid content-start gap-8">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { n: e.favoritos.length, t: "Favoritos", href: "/favoritos", i: Heart },
            { n: e.solicitudes.length, t: "Solicitudes", href: "/mis-solicitudes", i: ClipboardList },
            { n: e.visitas.length, t: "Visitas", href: "#visitas", i: CalendarCheck },
            { n: e.padrinazgos.length, t: "Apadrinados", href: "/donar#apadrinar", i: Gift },
          ].map((x) => (
            <li key={x.t}>
              <Link href={x.href} className="tarjeta eleva group block p-5">
                <x.i className="size-5 text-brand transition-transform group-hover:scale-110" aria-hidden="true" />
                <p className="mt-3 text-4xl font-bold tracking-tight">
                  <Contador valor={x.n} duracion={0.9} />
                </p>
                <p className="text-ink-2">{x.t}</p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="tarjeta p-6" aria-labelledby="t-sol">
          <div className="flex items-center justify-between">
            <h2 id="t-sol" className="t-h4">
              Solicitudes {enRevision > 0 && <span className="estado estado-revision ml-2 !min-h-7 text-sm">{enRevision} en revisión</span>}
            </h2>
            <Link href="/mis-solicitudes" className="enlace text-sm">
              Ver todas
            </Link>
          </div>
          <ul className="mt-4 grid gap-2">
            {e.solicitudes.slice(0, 3).map((s) => {
              const m = MASCOTAS.find((x) => x.id === s.mascota)!;
              return (
                <li key={s.id}>
                  <Link href={`/mis-solicitudes#${s.id}`} className="fila-lista rounded-xl">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                      <Image src={m.foto} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="flex-1">
                      <span className="font-semibold">{m.nombre}</span>
                      <span className="sub">{fechaCorta(s.fecha)} · {REFUGIOS[m.refugio].nombre}</span>
                    </span>
                    <span className={`estado !min-h-7 text-sm estado-${s.estado === "revision" ? "revision" : s.estado === "aprobada" ? "exito" : s.estado === "rechazada" ? "error" : "neutro"}`}>
                      {s.estado === "revision" ? "En revisión" : s.estado === "aprobada" ? "Aprobada" : s.estado === "rechazada" ? "No avanzó" : "Cancelada"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <section id="visitas" className="tarjeta scroll-mt p-6" aria-labelledby="t-vis">
            <h2 id="t-vis" className="t-h4 flex items-center gap-2">
              <CalendarCheck className="size-5 text-brand" aria-hidden="true" /> Visitas y eventos
            </h2>
            {e.visitas.length || eventos.length ? (
              <ul className="mt-4 grid gap-3">
                {e.visitas.map((v) => {
                  const m = MASCOTAS.find((x) => x.id === v.mascota)!;
                  return (
                    <li key={v.mascota} className="rounded-xl bg-surface p-3">
                      <p className="font-semibold">Visita a {m.nombre}</p>
                      <p className="text-sm text-ink-2">
                        {fechaLarga(v.dia)} · {v.hora} h · {REFUGIOS[m.refugio].nombre}
                      </p>
                    </li>
                  );
                })}
                {eventos.map((x) => (
                  <li key={x.id} className="rounded-xl bg-surface p-3">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <CalendarHeart className="size-4 text-brand" aria-hidden="true" /> {x.titulo}
                    </p>
                    <p className="text-sm text-ink-2">
                      {fechaLarga(x.fecha)} · {x.hora}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-ink-2">
                No agendaste nada todavía. Desde una ficha podés <strong>agendar una visita</strong> o activar recordatorios en{" "}
                <Link href="/eventos" className="enlace">
                  Eventos
                </Link>
                .
              </p>
            )}
          </section>

          <section className="tarjeta p-6" aria-labelledby="t-check">
            <h2 id="t-check" className="t-h4 flex items-center gap-2">
              <BookOpen className="size-5 text-brand" aria-hidden="true" /> ¿Estás listo/a para adoptar?
            </h2>
            <div className="mt-5 flex items-center gap-4">
              <span className="anillo" style={{ ["--p" as string]: progresoChecklist }}>
                <span>{progresoChecklist}%</span>
              </span>
              <p className="text-ink-2">
                Completaste {e.checklist.length} de {CHECKLIST.length} puntos del checklist de la guía.
              </p>
            </div>
            <Link href="/guia#checklist" className="btn btn-secundario btn-sm mt-5">
              Seguir con el checklist
            </Link>
          </section>
        </div>

        <section id="publicaciones" className="tarjeta scroll-mt p-6" aria-labelledby="t-pub">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="t-pub" className="t-h4 flex items-center gap-2">
              <Megaphone className="size-5 text-brand" aria-hidden="true" /> Mis publicaciones
            </h2>
            <Link href="/dar-en-adopcion" className="btn btn-primario btn-sm">
              Publicar un animal
            </Link>
          </div>
          {e.publicaciones.length ? (
            <ul className="mt-4 grid gap-2">
              {e.publicaciones.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-4">
                  <span>
                    <span className="block font-semibold">{p.nombre}</span>
                    <span className="text-sm capitalize text-ink-2">
                      {p.especie} · {fechaCorta(p.fecha)}
                    </span>
                  </span>
                  <span className="estado estado-revision text-sm">En revisión</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-ink-2">Si encontraste un animal o no podés seguir cuidándolo, publicalo de forma segura: un refugio aliado revisa los datos.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function EditarPerfil() {
  const { usuario } = useEstado();
  const [abierto, setAbierto] = useState(false);
  useLayoutEffect(() => () => setAbierto(false), []);
  if (!usuario) return null;

  const guardar = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const d = new FormData(ev.currentTarget);
    const nombre = String(d.get("nombre")).trim();
    if (nombre.length < 3) return;
    acciones.editarPerfil({ nombre, barrio: String(d.get("barrio")) });
    setAbierto(false);
    toast.success("Guardamos tus datos");
  };

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger className="btn btn-neutro btn-sm mt-5">
        <Pencil className="size-4" aria-hidden="true" /> Editar perfil
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg p-6 md:p-8" aria-describedby={undefined}>
          <Dialog.Title className="t-h3">Editar perfil</Dialog.Title>
          <form onSubmit={guardar} className="mt-6 grid gap-5">
            <div className="campo">
              <label htmlFor="pf-nombre" className="etiqueta">
                Nombre y apellido
              </label>
              <input id="pf-nombre" name="nombre" className="input" defaultValue={usuario.nombre} required minLength={3} autoComplete="name" />
            </div>
            <div className="campo">
              <label htmlFor="pf-barrio" className="etiqueta">
                Barrio
              </label>
              <p className="ayuda -mt-1">Lo usamos para mostrarte refugios y mascotas cercanas.</p>
              <select id="pf-barrio" name="barrio" className="select" defaultValue={usuario.barrio}>
                {BARRIOS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close className="btn btn-neutro">Cancelar</Dialog.Close>
              <button type="submit" className="btn btn-primario">
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
