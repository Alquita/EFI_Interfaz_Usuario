import type { SVGProps } from "react";
import {
  Camera,
  Car,
  Footprints,
  Heart,
  Megaphone,
  Package,
  PartyPopper,
  Scissors,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Huellita de la marca (se usa en logo, loaders y decoraciones) */
export function Huella({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <ellipse cx="14" cy="26" rx="6" ry="7.5" transform="rotate(-18 14 26)" />
      <ellipse cx="25" cy="13" rx="6" ry="8" transform="rotate(-6 25 13)" />
      <ellipse cx="39" cy="13" rx="6" ry="8" transform="rotate(6 39 13)" />
      <ellipse cx="50" cy="26" rx="6" ry="7.5" transform="rotate(18 50 26)" />
      <path d="M32 29c-8.5 0-16 10.5-16 18.2 0 5 3.4 8.3 8 8.3 3.6 0 5.2-1.8 8-1.8s4.4 1.8 8 1.8c4.6 0 8-3.3 8-8.3C48 39.5 40.5 29 32 29Z" />
    </svg>
  );
}

/** Loader: la huella se dibuja dedo por dedo */
export function LoaderHuella({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" role="img" aria-label="Cargando" className={cn("loader-huella text-brand-deco", className)}>
      <path d="M32 29c-8.5 0-16 10.5-16 18.2 0 5 3.4 8.3 8 8.3 3.6 0 5.2-1.8 8-1.8s4.4 1.8 8 1.8c4.6 0 8-3.3 8-8.3C48 39.5 40.5 29 32 29Z" />
      <ellipse cx="14" cy="26" rx="6" ry="7.5" />
      <ellipse cx="25" cy="13" rx="6" ry="8" />
      <ellipse cx="39" cy="13" rx="6" ry="8" />
      <ellipse cx="50" cy="26" rx="6" ry="7.5" />
    </svg>
  );
}

export function Logo({ className, claro = false }: { className?: string; claro?: boolean }) {
  return (
    <span className={cn("logo inline-flex items-center gap-2.5", className)}>
      <span className="logo-isotipo grid size-10 place-items-center rounded-[0.85rem] bg-accent text-white shadow-marca">
        <Huella className="size-6" />
      </span>
      <span className={cn("text-[1.375rem] font-bold tracking-[-0.04em]", claro ? "text-white" : "text-ink")}>
        Adopt<span className={claro ? "text-[#fdba74]" : "text-brand"}>App</span>
      </span>
    </span>
  );
}

/** Íconos nombrados en los datos (comunidad.ts) */
export const ICONOS: Record<string, LucideIcon> = {
  footprints: Footprints,
  camera: Camera,
  car: Car,
  party: PartyPopper,
  megaphone: Megaphone,
  heart: Heart,
  scissors: Scissors,
  stethoscope: Stethoscope,
  package: Package,
};

/* Redes (lucide 1.x ya no trae íconos de marcas) */
export function IconoInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconoFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5H15l.5-3.5h-4V7.8c0-.7.5-1.3 1.3-1.3H15V3Z" />
    </svg>
  );
}

export function IconoWhatsapp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2l-4.5 1.3Z" />
      <path d="M9 9.2c.3 2.5 2.4 4.9 5.6 5.7l1.1-1.2-1.7-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-1.7L9 9.2Z" />
    </svg>
  );
}
