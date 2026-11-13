# AdoptApp 🐾

**Adopción responsable en Río Cuarto.** AdoptApp es una web de adopción de perros y gatos que junta en un solo lugar a refugios, rescatistas y familias de la ciudad. Encontrás una mascota, conocés su historia, su salud y su carácter, y seguís tu solicitud sin perderte en mensajes.

Proyecto **EFI de Interfaz de Usuario** · ITEC Río Cuarto · 2026.

> Los datos de mascotas, refugios y usuarios son **de ejemplo**. Las fotos son de [Unsplash](https://unsplash.com). La app no tiene backend: guarda el estado en el navegador.

---

## Equipo

| Integrante |
| --- |
| Alcaraz Sgarlatta, Valentino |
| Castellano Varela, Joaquin |
| Ordoñez, Esteban Manuel |
| Piñeiro, Ignacio |

## Diseño

- **Figma (alta fidelidad, sistema de diseño y prototipo):** [AdoptApp – EFI Alta fidelidad](https://www.figma.com/design/1xcteOFyDwJMFMcEirnMdZ/AdoptApp-%E2%80%93-EFI-Alta-fidelidad)
- **Wireframe de baja fidelidad:** [AdoptApp – Wireframe baja fidelidad](https://www.figma.com/design/x61l6mhTqTOKKNj5nzMthy/AdoptApp-%E2%80%93-Wireframe-baja-fidelidad)
- **Presentación:** [Presentación AdoptApp](https://www.figma.com/proto/1xcteOFyDwJMFMcEirnMdZ/AdoptApp?node-id=20-6442&starting-point-node-id=20-6442&scaling=scale-down&hide-ui=1)

---

## Qué hace

### Lo más distinto

- **Descubrir:** conocés mascotas deslizando, como en una app de citas, con tu % de compatibilidad en cada tarjeta.
- **Test de compatibilidad:** recomienda mascotas reales, con los motivos y las alertas.
- **Comparador de favoritos:** hasta 3 mascotas lado a lado.
- **Costo mensual en cada ficha:** sabés cuánto vas a gastar antes de adoptar.
- **Seguimiento de la solicitud:** línea de tiempo, estados claros y mensajes del refugio. Se terminó el "mandé un mensaje y no sé en qué quedó".

### Para quien adopta

- **Descubrir:** se arrastra, se usa con botones o con el teclado. Se puede deshacer, y lo que te gusta va directo a favoritos.
- **Test de compatibilidad:** 5 preguntas sobre tu casa, tu tiempo, si hay chicos y si tenés otros animales. Devuelve un top 3 de mascotas reales con su % y avisos como "No convive con gatos". Ese % después aparece en la ficha, en Descubrir y en el comparador.
- **Comparador de favoritos:** edad, tamaño, salud, convivencia, carácter, refugio, costo por mes y compatibilidad, todo en una tabla.
- **Costo mensual estimado:** en cada ficha, según especie y tamaño, más una calculadora con extras (paseador, peluquería, plan de salud).
- **Convivencia honesta:** perros, gatos y chicos con "Sí", "No" o "Todavía no se probó". El "no sé" está permitido en vez de esconderlo.
- **Agendar una visita desde la ficha:** con los días y horarios reales de cada refugio.
- **Solicitud guiada en 3 pasos:** con validación clara y un resumen editable antes de enviar.
- **"¿Estás listo/a para adoptar?":** un checklist que se guarda y muestra tu progreso en el perfil.

### Más allá de adoptar

- **Perdidos y encontrados:** reportás en un minuto, compartís por WhatsApp y hay consejos para cada caso.
- **Necesidades de cada refugio a la vista:** por ejemplo, "Antiparasitarios: 25 % cubierto".
- **Donación con impacto concreto:** "Con $16.000 ≈ 2 castraciones".
- **Apadrinar** a los que más tiempo llevan esperando (seniors y adultos).
- **Eventos locales:** con recordatorio y botón "Agregar al calendario".
- **Hogar de tránsito, voluntariado por rol y "Sumar tu refugio":** todo en la misma app.
- **100 % local:** refugios, barrios y mapa de Río Cuarto con horarios y cómo llegar.

### Accesibilidad e interfaz

- Modo claro, oscuro o según el sistema, sin parpadeo al cargar.
- Opciones de **texto grande** y **reducir movimiento** desde Ajustes.
- Enlace "Saltar al contenido", foco visible y navegación completa con teclado.
- Contraste de texto de 4.5:1 como mínimo; botones de 48 px y áreas táctiles de 44 × 44 px.
- Formularios con etiquetas visibles y errores asociados a cada campo.
- Diseño responsive: barra inferior en el celular y menú completo en escritorio.

---

## Tecnologías

| Uso | Herramienta |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS 4 + tokens CSS propios (`src/styles`) |
| Componentes accesibles | Radix UI (diálogo, pestañas, acordeón, switch, menú) |
| Formularios | React Hook Form + Zod |
| Mapa | Leaflet + React Leaflet, con mapas de OpenStreetMap |
| Animaciones | Motion |
| Carruseles | Embla Carousel |
| Íconos | Lucide |
| Avisos | Sonner |

## Cómo correrlo

Requisitos: **Node.js 20 o superior** y npm.

```bash
git clone https://github.com/Alquita/EFI_Interfaz_Usuario.git
cd EFI_Interfaz_Usuario
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con ESLint |

---

## Páginas

| Ruta | Página |
| --- | --- |
| `/` | Inicio: hero, catálogo con filtros y secciones |
| `/descubrir` | Descubrir mascotas deslizando |
| `/guia` | Guía para adoptar, checklist, costos y test de compatibilidad |
| `/mascota/[id]` | Ficha de cada mascota |
| `/adoptar/[id]` | Solicitud de adopción en 3 pasos |
| `/favoritos` | Favoritos y comparador |
| `/mis-solicitudes` | Seguimiento de solicitudes |
| `/refugios` · `/refugios/[id]` | Mapa y ficha de cada refugio |
| `/dar-en-adopcion` | Publicar un animal |
| `/perdidos` | Perdidos y encontrados |
| `/eventos` | Eventos locales |
| `/transito` · `/voluntariado` · `/sumar-refugio` | Formas de sumarse |
| `/donar` | Donar y apadrinar |
| `/historias` | Historias de adopción |
| `/perfil` · `/ajustes` · `/notificaciones` · `/ingresar` | Cuenta |
| `/nosotros` · `/ayuda` · `/accesibilidad` · `/contacto` | Información |

## Estructura

```
src/
├── app/          Rutas (App Router), layout y estilos globales
├── components/
│   ├── sitio/        Encabezado, pie, barra inferior, tema
│   ├── inicio/       Hero, catálogo y secciones del inicio
│   ├── descubrir/    Mazo de tarjetas deslizables
│   ├── mascotas/     Tarjeta, ficha, favoritos y solicitud
│   ├── cuenta/       Perfil, ajustes, solicitudes y notificaciones
│   ├── comunidad/    Perdidos, eventos, donar, refugios y más
│   ├── mapa/         Mapa de refugios (Leaflet)
│   ├── guia/         Guía y test de compatibilidad
│   └── ui/           Componentes base (formularios, carrusel, marca…)
├── data/         Datos de ejemplo: mascotas, refugios, eventos, barrios…
├── lib/          Estado (store), apariencia y utilidades
├── styles/       Tokens, base, componentes y animaciones
└── types/        Tipos de TypeScript
public/img/       Fotos de mascotas, banners e imágenes
```

### Datos y estado

No hay base de datos. Favoritos, solicitudes, notificaciones, sesión, ajustes, publicaciones y reportes se guardan en el `localStorage` del navegador (`src/lib/store.ts`). Para volver al estado inicial, borrá los datos del sitio en el navegador.

---

## Créditos

- Fotos: [Unsplash](https://unsplash.com) (licencia Unsplash).
- Mapa: © [OpenStreetMap](https://www.openstreetmap.org/copyright) y colaboradores.
- Íconos: [Lucide](https://lucide.dev).

Proyecto académico, sin fines comerciales.
