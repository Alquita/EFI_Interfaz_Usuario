"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Heart,
  LogIn,
  LogOut,
  Menu as IconoMenu,
  Megaphone,
  Settings,
  User,
  X,
} from "lucide-react";
import { acciones, useEstado, useHidratado } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MASCOTAS } from "@/data/mascotas";
import { Logo } from "@/components/ui/Marca";
import { BotonTema } from "./BotonTema";
import { IconoNotificacion } from "./IconoNotificacion";
import { MENU_ADOPTAR, MENU_COMUNIDAD, MENU_INFO, tieneFotoArriba, type EnlaceNav } from "./navegacion";

function suscribirScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function useDesplazado() {
  return useSyncExternalStore(
    suscribirScroll,
    () => window.scrollY > 24,
    () => false,
  );
}

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function Encabezado() {
  const ruta = usePathname();
  const desplazado = useDesplazado();
  const [oculto, setOculto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  /* Se esconde al bajar y vuelve al subir */
  useMotionValueEvent(scrollY, "change", (y) => {
    const previo = scrollY.getPrevious() ?? 0;
    if (y < 320) setOculto(false);
    else if (y > previo + 4) setOculto(true);
    else if (y < previo - 4) setOculto(false);
  });

  const sobreFoto = tieneFotoArriba(ruta) && !desplazado && !menuAbierto;

  return (
    <>
      <header
        className={cn("encabezado", sobreFoto && "sobre-foto", desplazado && "desplazado", oculto && "oculto")}
      >
        <div className="contenedor flex h-full items-center gap-2">
          <Link href="/" className="rounded-xl" aria-label="AdoptApp, ir al inicio">
            <Logo claro={sobreFoto} />
          </Link>

          <nav aria-label="Principal" className="ml-6 hidden items-center gap-0.5 lg:flex">
            <MenuMega titulo="Adoptar" items={MENU_ADOPTAR} ruta={ruta} destacado />
            <EnlaceNavegacion href="/refugios" ruta={ruta}>
              Refugios
            </EnlaceNavegacion>
            <MenuMega titulo="Comunidad" items={MENU_COMUNIDAD} ruta={ruta} columnas />
            <EnlaceNavegacion href="/eventos" ruta={ruta}>
              Eventos
            </EnlaceNavegacion>
            <MenuMega titulo="Más" items={MENU_INFO} ruta={ruta} />
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <BotonTema />
            <MenuNotificaciones />
            <ContadorFavoritos />
            <MenuUsuario />
            <Link href="/dar-en-adopcion" className="btn btn-primario btn-sm ml-2 hidden xl:inline-flex">
              <Megaphone className="size-4" aria-hidden="true" />
              Dar en adopción
            </Link>
            <Dialog.Root open={menuAbierto} onOpenChange={setMenuAbierto}>
              <Dialog.Trigger className="icon-btn lg:hidden" aria-label="Abrir menú">
                <IconoMenu className="size-6" />
              </Dialog.Trigger>
              <CajonMovil cerrar={() => setMenuAbierto(false)} ruta={ruta} />
            </Dialog.Root>
          </div>
        </div>
        <motion.div className="encabezado-progreso" style={{ scaleX: progreso }} aria-hidden="true" />
      </header>
      {!tieneFotoArriba(ruta) && <div style={{ height: "var(--header-h)" }} aria-hidden="true" />}
    </>
  );
}

function EnlaceNavegacion({ href, ruta, children }: { href: string; ruta: string; children: React.ReactNode }) {
  const activo = ruta === href || ruta.startsWith(href + "/");
  return (
    <Link href={href} className="nav-enlace" aria-current={activo ? "page" : undefined}>
      {children}
      {activo && <motion.span layoutId="nav-activo" className="nav-marca" />}
    </Link>
  );
}

function MenuMega({
  titulo,
  items,
  ruta,
  columnas = false,
  destacado = false,
}: {
  titulo: string;
  items: EnlaceNav[];
  ruta: string;
  columnas?: boolean;
  destacado?: boolean;
}) {
  const activo = items.some((i) => i.href !== "/#mascotas" && ruta.startsWith(i.href.split("#")[0]) && i.href !== "/");
  const bruno = MASCOTAS.find((m) => m.id === "bruno")!;
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className="nav-enlace group" aria-current={activo ? "true" : undefined}>
        {titulo}
        <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
        {activo && <motion.span layoutId="nav-activo" className="nav-marca" />}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          className={cn("desplegable", columnas ? "w-[38rem]" : destacado ? "w-[40rem]" : "w-[22rem]")}
          sideOffset={14}
          align="start"
        >
          <div className={cn("grid gap-1", (columnas || destacado) && "grid-cols-2")}>
            <div className={cn("grid gap-0.5", columnas && "col-span-2 grid-cols-2")}>
              {items.map((it) => (
                <Menu.Item key={it.href} asChild>
                  <Link href={it.href} className="item-menu" aria-current={ruta === it.href ? "page" : undefined}>
                    <span className="icono-menu">
                      <it.icono className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="font-semibold">{it.titulo}</span>
                      <small>{it.sub}</small>
                    </span>
                  </Link>
                </Menu.Item>
              ))}
            </div>
            {destacado && (
              <Menu.Item asChild>
                <Link href="/mascota/bruno" className="menu-destacado group/d">
                  <Image src={bruno.foto} alt="" fill sizes="20rem" className="object-cover transition-transform duration-700 group-hover/d:scale-105" />
                  <span className="relative z-10 mt-auto p-4 text-white">
                    <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
                      Adoptá un senior
                    </span>
                    <span className="block text-xl font-bold">Bruno te espera</span>
                    <span className="block text-sm text-white/85">9 años de puro corazón · Alberdi</span>
                  </span>
                </Link>
              </Menu.Item>
            )}
          </div>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function MenuNotificaciones() {
  const { notificaciones } = useEstado();
  const hidratado = useHidratado();
  const sinLeer = notificaciones.filter((n) => !n.leida).length;
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className="icon-btn" aria-label={`Notificaciones${sinLeer ? `, ${sinLeer} sin leer` : ""}`}>
        <Bell className="size-5" />
        {hidratado && sinLeer > 0 && (
          <motion.span key={sinLeer} initial={{ scale: 0 }} animate={{ scale: 1 }} className="contador-badge">
            {sinLeer}
          </motion.span>
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className="desplegable w-[min(24rem,calc(100vw-1.5rem))]" sideOffset={14} align="end">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="font-bold">Notificaciones</p>
            {sinLeer > 0 && (
              <button type="button" className="enlace text-sm" onClick={() => acciones.marcarTodasLeidas()}>
                Marcar todas como leídas
              </button>
            )}
          </div>
          <div className="grid max-h-[22rem] gap-1 overflow-y-auto">
            {notificaciones.slice(0, 4).map((n) => (
              <Menu.Item key={n.id} asChild>
                <Link
                  href={n.link}
                  className={cn("item-menu !items-start", !n.leida && "bg-accent-soft")}
                  onClick={() => acciones.marcarLeida(n.id)}
                >
                  <IconoNotificacion n={n} className="size-10" />
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug">{n.titulo}</span>
                    <small>{n.cuando}</small>
                  </span>
                </Link>
              </Menu.Item>
            ))}
          </div>
          <Menu.Separator className="my-2 h-px bg-line" />
          <Menu.Item asChild>
            <Link href="/notificaciones" className="item-menu justify-center font-semibold !text-brand">
              Ver todas
            </Link>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function ContadorFavoritos() {
  const { favoritos } = useEstado();
  const hidratado = useHidratado();
  return (
    <Link href="/favoritos" className="icon-btn hidden sm:inline-grid" aria-label={`Favoritos, ${favoritos.length} guardados`}>
      <Heart className="size-5" />
      {hidratado && favoritos.length > 0 && (
        <motion.span key={favoritos.length} initial={{ scale: 0 }} animate={{ scale: 1 }} className="contador-badge">
          {favoritos.length}
        </motion.span>
      )}
    </Link>
  );
}

function MenuUsuario() {
  const { usuario, solicitudes } = useEstado();
  const router = useRouter();
  const enRevision = solicitudes.filter((s) => s.estado === "revision").length;

  if (!usuario) {
    return (
      <Link href="/ingresar" className="btn btn-fantasma btn-sm hidden lg:inline-flex">
        <LogIn className="size-4" aria-hidden="true" />
        Ingresar
      </Link>
    );
  }

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className="avatar-btn hidden lg:inline-flex" aria-label={`Cuenta de ${usuario.nombre}`}>
        <span className="avatar">{iniciales(usuario.nombre)}</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className="desplegable w-72" sideOffset={14} align="end">
          <div className="flex items-center gap-3 px-3 pb-3 pt-1">
            <span className="avatar size-11 text-base">{iniciales(usuario.nombre)}</span>
            <span className="min-w-0">
              <span className="block truncate font-bold">{usuario.nombre}</span>
              <span className="block truncate text-sm text-ink-2">{usuario.correo}</span>
            </span>
          </div>
          <Menu.Separator className="mb-1 h-px bg-line" />
          {[
            { href: "/perfil", t: "Mi perfil", i: User },
            { href: "/mis-solicitudes", t: "Mis solicitudes", i: ClipboardList, n: enRevision },
            { href: "/favoritos", t: "Favoritos", i: Heart },
            { href: "/ajustes", t: "Ajustes", i: Settings },
          ].map((it) => (
            <Menu.Item key={it.href} asChild>
              <Link href={it.href} className="item-menu">
                <it.i className="size-5" aria-hidden="true" />
                {it.t}
                {it.n ? <span className="estado estado-revision ml-auto !min-h-6 !px-2 text-xs">{it.n}</span> : null}
              </Link>
            </Menu.Item>
          ))}
          <Menu.Separator className="my-1 h-px bg-line" />
          <Menu.Item
            className="item-menu"
            onSelect={() => {
              acciones.salir();
              router.push("/");
            }}
          >
            <LogOut className="size-5" aria-hidden="true" />
            Cerrar sesión
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function CajonMovil({ cerrar, ruta }: { cerrar: () => void; ruta: string }) {
  const { usuario } = useEstado();
  const grupos = [
    { titulo: "Adoptar", items: MENU_ADOPTAR },
    { titulo: "Comunidad", items: MENU_COMUNIDAD },
    { titulo: "AdoptApp", items: MENU_INFO },
  ];
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="dlg-overlay" />
      <Dialog.Content className="dlg-cajon flex flex-col" aria-describedby={undefined}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-5 py-3 backdrop-blur">
          <Dialog.Title asChild>
            <span>
              <Logo />
              <span className="sr-only">Menú</span>
            </span>
          </Dialog.Title>
          <Dialog.Close className="icon-btn" aria-label="Cerrar menú">
            <X className="size-6" />
          </Dialog.Close>
        </div>
        <div className="flex-1 px-3 py-4">
          <Link
            href={usuario ? "/perfil" : "/ingresar"}
            onClick={cerrar}
            className="mx-2 mb-4 flex items-center gap-3 rounded-2xl bg-surface p-4"
          >
            <span className="avatar size-12 text-base">{usuario ? iniciales(usuario.nombre) : <User className="size-5" />}</span>
            <span>
              <span className="block font-bold">{usuario ? usuario.nombre : "Ingresá a tu cuenta"}</span>
              <span className="block text-sm text-ink-2">{usuario ? "Ver mi perfil y solicitudes" : "Guardá favoritos y seguí tus solicitudes"}</span>
            </span>
          </Link>
          {grupos.map((g, gi) => (
            <motion.div
              key={g.titulo}
              className="mb-4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + gi * 0.06, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <p className="t-eyebrow px-4 pb-1 !text-xs">{g.titulo}</p>
              {g.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={cerrar}
                  className="item-menu"
                  aria-current={ruta === it.href ? "page" : undefined}
                >
                  <span className="icono-menu">
                    <it.icono className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="font-semibold">{it.titulo}</span>
                    <small>{it.sub}</small>
                  </span>
                </Link>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="sticky bottom-0 grid gap-2 border-t border-line bg-bg/95 p-4 backdrop-blur">
          <Link href="/dar-en-adopcion" onClick={cerrar} className="btn btn-primario btn-bloque">
            <Megaphone className="size-5" aria-hidden="true" />
            Dar en adopción
          </Link>
          <BotonTema conTexto />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
