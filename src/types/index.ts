/* Tipos del dominio de AdoptApp */

export type Especie = "perro" | "gato";
export type Sexo = "hembra" | "macho";
export type Tamano = "pequeno" | "mediano" | "grande";
export type Etapa = "cachorro" | "joven" | "adulto" | "mayor";
export type EstadoMascota = "disponible" | "reservado";
export type RefugioId = "huellitas" | "gatuno" | "patitas";

/** true = se lleva bien · false = no · null = todavía no se probó */
export type Convivencia = boolean | null;

export interface Mascota {
  id: string;
  nombre: string;
  especie: Especie;
  sexo: Sexo;
  edadMeses: number;
  edad: string;
  tamano: Tamano;
  tipo: string;
  peso: string;
  barrio: string;
  refugio: RefugioId;
  distancia: number;
  estado: EstadoMascota;
  publicado: string;
  foto: string;
  alt: string;
  salud: string[];
  castrado: boolean;
  saludTexto: string;
  temperamento: string;
  rasgos: string[];
  convive: { perros: Convivencia; gatos: Convivencia; chicos: Convivencia };
}

export interface Refugio {
  id: RefugioId;
  nombre: string;
  barrio: string;
  distancia: number;
  horario: string;
  horarioLargo: string;
  telefono: string;
  especies: string;
  descripcion: string;
  foto: string;
  coordenadas: [number, number];
  necesidades: Necesidad[];
}

export interface Necesidad {
  item: string;
  porcentaje: number;
}

export type EstadoSolicitud = "revision" | "aprobada" | "rechazada" | "cancelada";

export interface DatosSolicitud {
  nombre: string;
  telefono: string;
  correo: string;
  barrio: string;
  vivienda: string;
  otras: string;
  otrasCuales?: string;
  acuerdo?: boolean;
  rutina?: string;
  seguimiento?: boolean;
}

export interface Solicitud {
  id: string;
  mascota: string;
  fecha: string;
  estado: EstadoSolicitud;
  mensaje: string;
  mensajeRefugio?: string;
  datos?: DatosSolicitud;
}

export type TipoNotificacion = "success" | "brand" | "review" | "error" | "info";

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  icono: "check" | "paw" | "clock" | "x" | "info";
  titulo: string;
  texto: string;
  cuando: string;
  leida: boolean;
  link: string;
}

export interface Historia {
  id: string;
  titulo: string;
  quienes: string;
  mascota: string;
  especie: Especie;
  refugio: RefugioId;
  fecha: string;
  foto: string;
  alt: string;
  resumen: string;
  cita: string;
}

export interface ReportePerdido {
  id: string;
  tipo: "perdido" | "encontrado";
  especie: Especie;
  nombre: string;
  barrio: string;
  fecha: string;
  foto: string;
  alt: string;
  descripcion: string;
  telefono: string;
}

export type TipoEvento = "adopcion" | "castracion" | "salud" | "colecta" | "charla";

export interface Evento {
  id: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  titulo: string;
  lugar: string;
  organiza: string;
  descripcion: string;
}

export type CategoriaPregunta = "adoptar" | "dar" | "cuenta" | "refugios" | "accesibilidad";

export interface Pregunta {
  cat: CategoriaPregunta;
  p: string;
  r: string;
}

export interface Usuario {
  nombre: string;
  correo: string;
  barrio: string;
}

export interface Ajustes {
  notifSolicitudes: boolean;
  notifCerca: boolean;
  notifCorreo: boolean;
  reducirMovimiento: boolean;
  textoGrande: boolean;
}

export interface Publicacion {
  id: string;
  nombre: string;
  especie: string;
  fecha: string;
  estado: "revision";
}

export interface FiltrosCatalogo {
  q: string;
  especie: Especie[];
  tamano: Tamano[];
  etapa: Etapa[];
  sexo: Sexo[];
  castrado: boolean;
  refugio: RefugioId | "";
  orden: "cercania" | "recientes" | "menor" | "mayor";
}
