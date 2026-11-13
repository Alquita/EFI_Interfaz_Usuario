import type { Metadata } from "next";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Notificaciones } from "@/components/cuenta/Notificaciones";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata: Metadata = { title: "Notificaciones" };

export default function PaginaNotificaciones() {
  return (
    <div className="contenedor pb-10">
      <TituloPagina
        className="mx-auto max-w-3xl"
        antetitulo="Novedades"
        titulo="Notificaciones"
        acciones={
          <Link href="/ajustes#notificaciones" className="btn btn-neutro btn-sm">
            <Settings className="size-4" aria-hidden="true" /> Preferencias
          </Link>
        }
      />
      <Notificaciones />
    </div>
  );
}
