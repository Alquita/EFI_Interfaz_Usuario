import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SCRIPT_APARIENCIA } from "@/lib/apariencia";
import { Proveedores } from "@/components/sitio/Proveedores";
import { Encabezado } from "@/components/sitio/Encabezado";
import { BarraInferior } from "@/components/sitio/BarraInferior";
import { Pie } from "@/components/sitio/Pie";
import { VolverArriba } from "@/components/sitio/VolverArriba";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AdoptApp · Adopción responsable en Río Cuarto",
    template: "%s · AdoptApp",
  },
  description:
    "Perros y gatos de refugios y rescatistas de Río Cuarto en un solo lugar: ficha completa, solicitud guiada en 3 pasos, mapa de refugios y seguimiento.",
  applicationName: "AdoptApp",
  metadataBase: new URL("https://adoptapp.ejemplo"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_APARIENCIA }} />
      </head>
      <body className="con-barra-inferior flex min-h-dvh flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Proveedores>
          <Encabezado />
          <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Pie />
          <VolverArriba />
          <BarraInferior />
        </Proveedores>
      </body>
    </html>
  );
}
