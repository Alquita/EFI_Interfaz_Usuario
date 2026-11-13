import {
  BookOpen,
  CalendarHeart,
  CircleHelp,
  Compass,
  Gift,
  HandHeart,
  Heart,
  House,
  MapPinned,
  PawPrint,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface EnlaceNav {
  href: string;
  titulo: string;
  sub: string;
  icono: LucideIcon;
}

export const MENU_ADOPTAR: EnlaceNav[] = [
  { href: "/#mascotas", titulo: "Ver mascotas", sub: "Catálogo con filtros y mapa", icono: PawPrint },
  { href: "/descubrir", titulo: "Descubrir", sub: "Deslizá y encontrá tu match", icono: Sparkles },
  { href: "/guia#test", titulo: "Test de compatibilidad", sub: "5 preguntas, recomendaciones reales", icono: Compass },
  { href: "/guia", titulo: "Guía para adoptar", sub: "Checklist, costos y primeros días", icono: BookOpen },
  { href: "/historias", titulo: "Historias", sub: "Familias que ya adoptaron", icono: Heart },
];

export const MENU_COMUNIDAD: EnlaceNav[] = [
  { href: "/perdidos", titulo: "Perdidos y encontrados", sub: "Reportá o ayudá a buscar", icono: Search },
  { href: "/eventos", titulo: "Eventos", sub: "Ferias, castraciones y charlas", icono: CalendarHeart },
  { href: "/transito", titulo: "Hogar de tránsito", sub: "Cuidá por un tiempo", icono: House },
  { href: "/voluntariado", titulo: "Voluntariado", sub: "Sumá tus horas y talentos", icono: Users },
  { href: "/donar", titulo: "Donar y apadrinar", sub: "Alimento, vacunas y castraciones", icono: Gift },
  { href: "/sumar-refugio", titulo: "Sumar tu refugio", sub: "Gratis para refugios y rescatistas", icono: Store },
];

export const MENU_INFO: EnlaceNav[] = [
  { href: "/nosotros", titulo: "Nosotros", sub: "Por qué hicimos AdoptApp", icono: HandHeart },
  { href: "/ayuda", titulo: "Preguntas frecuentes", sub: "Respuestas rápidas", icono: CircleHelp },
  { href: "/accesibilidad", titulo: "Accesibilidad", sub: "Cómo la hicimos para todos", icono: ShieldCheck },
  { href: "/refugios", titulo: "Mapa de refugios", sub: "Horarios y cómo llegar", icono: MapPinned },
];

/* Rutas cuya cabecera es una foto: el encabezado arranca transparente y en blanco */
export function tieneFotoArriba(ruta: string) {
  if (ruta === "/") return true;
  const conBanner = [
    "/nosotros", "/guia", "/donar", "/accesibilidad", "/historias", "/contacto", "/ayuda",
    "/eventos", "/transito", "/refugios", "/voluntariado", "/perdidos", "/descubrir",
    "/sumar-refugio", "/dar-en-adopcion",
  ];
  return conBanner.some((r) => ruta === r || ruta.startsWith(r + "/"));
}
