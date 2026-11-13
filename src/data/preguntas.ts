/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { CategoriaPregunta, Pregunta } from "@/types";

export const CATEGORIAS: { id: CategoriaPregunta | "todas"; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "adoptar", nombre: "Adoptar" },
  { id: "dar", nombre: "Dar en adopción" },
  { id: "cuenta", nombre: "Cuenta" },
  { id: "refugios", nombre: "Refugios" },
  { id: "accesibilidad", nombre: "Accesibilidad" },
];

export const PREGUNTAS: Pregunta[] = [
  { cat: "adoptar", p: "¿Cuánto cuesta adoptar?", r: "Adoptar es gratis. Algunos refugios piden una colaboración voluntaria para cubrir vacunas y castración, y siempre te lo dicen antes de empezar." },
  { cat: "adoptar", p: "¿Qué requisitos piden los refugios?", r: "Ser mayor de 18 años, que todas las personas de la casa estén de acuerdo, y aceptar una visita o llamada de seguimiento. Cada refugio puede sumar requisitos propios, que ves en la ficha." },
  { cat: "adoptar", p: "¿Cuánto tardan en responder mi solicitud?", r: "En general, 48 horas hábiles. Vas a ver el estado en “Mis solicitudes” y te avisamos con una notificación cuando cambie." },
  { cat: "adoptar", p: "¿Puedo adoptar si alquilo?", r: "Sí. Te recomendamos chequear que el contrato permita mascotas. Algunos refugios pueden pedirte una constancia." },
  { cat: "adoptar", p: "¿Los animales se entregan castrados y vacunados?", r: "Casi siempre. Si un animal todavía no está castrado (por ejemplo, un cachorro), el refugio coordina la castración con vos y está incluida." },
  { cat: "adoptar", p: "¿Puedo enviar más de una solicitud?", r: "Sí, pero te pedimos que lo hagas solo por animales que realmente podés adoptar, así los refugios priorizan a las familias más comprometidas." },
  { cat: "dar", p: "¿Quién revisa mi publicación?", r: "Un refugio aliado revisa los datos y las fotos antes de que la publicación salga. Te escribe al correo de tu cuenta en 48 horas." },
  { cat: "dar", p: "¿Puedo publicar un animal que encontré en la calle?", r: "Primero publicalo en “Perdidos y encontrados” por si alguien lo está buscando. Si en 7 días nadie lo reclama, podés darlo en adopción." },
  { cat: "dar", p: "¿Cuánto tiempo queda publicado?", r: "Hasta que encuentre familia. Cada 30 días te pedimos confirmar que sigue disponible." },
  { cat: "cuenta", p: "¿Necesito una cuenta para ver las mascotas?", r: "No. Podés ver el catálogo, el mapa y las fichas sin cuenta. Para enviar solicitudes y guardar favoritos sí necesitás ingresar." },
  { cat: "cuenta", p: "¿Cómo activo el modo oscuro?", r: "Desde el botón de luna en el encabezado, desde el menú o en Ajustes › Apariencia. La app recuerda tu elección." },
  { cat: "cuenta", p: "¿Cómo cierro sesión o borro mi cuenta?", r: "En Perfil o en Ajustes vas a encontrar “Cerrar sesión”. Para borrar tu cuenta escribinos desde Contacto." },
  { cat: "refugios", p: "¿Cómo sumo mi refugio a AdoptApp?", r: "Completá el formulario de “Sumar tu refugio”. Te contactamos para conocerlos y darles acceso para publicar y gestionar solicitudes." },
  { cat: "refugios", p: "¿Tiene algún costo para los refugios?", r: "No. AdoptApp es gratuita para refugios y rescatistas de Río Cuarto." },
  { cat: "accesibilidad", p: "¿Funciona con lector de pantalla?", r: "Sí. Todas las imágenes tienen descripción, los botones tienen nombre accesible y podés usar toda la app solo con el teclado." },
  { cat: "accesibilidad", p: "¿Puedo agrandar el texto o reducir las animaciones?", r: "Sí, en Ajustes › Accesibilidad podés activar “Texto más grande” (25 % más) y “Reducir movimiento”." }
];
