"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { LoaderHuella } from "@/components/ui/Marca";
import type { PropsMapa } from "./MapaInterno";

/* Leaflet necesita window: se carga solo en el navegador */
const MapaInterno = dynamic(() => import("./MapaInterno"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center bg-surface-2">
      <LoaderHuella className="size-12" />
    </div>
  ),
});

export function MapaRefugios({ className, ...props }: PropsMapa & { className?: string }) {
  return (
    <div className={cn("mapa-wrap", className)}>
      <MapaInterno {...props} />
    </div>
  );
}
