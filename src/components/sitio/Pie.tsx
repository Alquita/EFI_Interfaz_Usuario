import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { LISTA_REFUGIOS } from "@/data/refugios";
import { Huella, IconoFacebook, IconoInstagram, IconoWhatsapp, Logo } from "@/components/ui/Marca";
import { Boletin } from "./Boletin";
import { MENU_ADOPTAR, MENU_COMUNIDAD, MENU_INFO } from "./navegacion";

export function Pie() {
  return (
    <footer className="pie relative isolate mt-24 overflow-hidden bg-brown text-white">
      <div className="textura-huellas pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <Huella className="pointer-events-none absolute -right-16 -top-10 -z-10 size-[26rem] rotate-[24deg] text-white/[0.04]" />

      <div className="contenedor grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="t-eyebrow !text-[#fdba74]">Novedades de los refugios</p>
          <h2 className="t-h2 mt-2 max-w-xl">Enterate primero cuando llega alguien que te puede gustar.</h2>
          <p className="mt-3 max-w-lg text-[#e7d9d1]">
            Un correo por semana con recién llegados, jornadas de castración y eventos en Río Cuarto. Sin spam.
          </p>
        </div>
        <Boletin />
      </div>

      <div className="contenedor grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo claro />
          <p className="mt-4 text-[#e7d9d1]">
            Adopción responsable de perros y gatos en Río Cuarto. Refugios, rescatistas y familias en un solo lugar.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { i: IconoInstagram, t: "Instagram" },
              { i: IconoFacebook, t: "Facebook" },
              { i: IconoWhatsapp, t: "WhatsApp" },
            ].map(({ i: I, t }) => (
              <a key={t} href="#" className="icon-btn icon-btn-vidrio" aria-label={`AdoptApp en ${t} (ejemplo)`}>
                <I className="size-5" />
              </a>
            ))}
          </div>
        </div>
        {[
          { titulo: "Adoptar", items: MENU_ADOPTAR },
          { titulo: "Comunidad", items: MENU_COMUNIDAD },
          { titulo: "AdoptApp", items: [...MENU_INFO, { href: "/contacto", titulo: "Contacto" }] },
        ].map((col) => (
          <nav key={col.titulo} aria-label={col.titulo}>
            <h3 className="mb-3 font-bold">{col.titulo}</h3>
            <ul className="pie-enlaces grid gap-0.5 [&_a]:!text-[#e7d9d1] [&_a:hover]:!text-[#fdba74]">
              {col.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href}>{it.titulo}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="contenedor grid gap-4 pb-12 md:grid-cols-3">
        {LISTA_REFUGIOS.map((r) => (
          <Link
            key={r.id}
            href={`/refugios/${r.id}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#fdba74]/50 hover:bg-white/[0.07]"
          >
            <p className="font-bold group-hover:text-[#fdba74]">{r.nombre}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-[#e7d9d1]">
              <MapPin className="size-4 shrink-0" aria-hidden="true" /> {r.barrio}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#e7d9d1]">
              <Clock className="size-4 shrink-0" aria-hidden="true" /> {r.horario}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#e7d9d1]">
              <Phone className="size-4 shrink-0" aria-hidden="true" /> {r.telefono}
            </p>
          </Link>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="contenedor flex flex-col gap-3 py-6 text-sm text-[#e7d9d1] md:flex-row md:items-center md:justify-between">
          <p>© 2026 AdoptApp · Proyecto EFI de Interfaz · Datos y fotos de ejemplo (Unsplash).</p>
          <p className="flex items-center gap-2">
            <Mail className="size-4" aria-hidden="true" /> hola@adoptapp.ejemplo
          </p>
        </div>
      </div>
    </footer>
  );
}
