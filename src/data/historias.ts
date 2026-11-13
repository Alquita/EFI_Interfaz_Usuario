/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { Historia } from "@/types";

export const HISTORIAS: Historia[] = [
  { id: "h1", titulo: "Toby encontró a su familia", quienes: "Sofi y Martín", mascota: "Toby", especie: "perro", refugio: "huellitas", fecha: "Agosto 2026", foto: "/img/historias/pareja.jpg", alt: "Pareja sonriendo en su living con un perro blanco y negro entre los dos",
    resumen: "Llegó al refugio después de pasar el invierno en la calle. Hoy duerme en el sillón y saluda a todo el edificio.",
    cita: "Pensábamos que íbamos a rescatarlo nosotros, pero nos rescató él." },
  { id: "h2", titulo: "Rayo y Lucas, inseparables", quienes: "Lucas", mascota: "Rayo", especie: "perro", refugio: "patitas", fecha: "Junio 2026", foto: "/img/historias/abrazo.jpg", alt: "Joven abrazando a un perro dorado al aire libre con montañas de fondo",
    resumen: "Rayo tenía 7 años y nadie preguntaba por él. Lucas vio su ficha y fue a conocerlo ese mismo sábado.",
    cita: "Adoptar un perro adulto fue la mejor decisión: ya venía educado y con todo el amor para dar." },
  { id: "h3", titulo: "Miel llegó para quedarse", quienes: "Juli y Ana", mascota: "Miel", especie: "perro", refugio: "huellitas", fecha: "Mayo 2026", foto: "/img/historias/amigas.jpg", alt: "Dos amigas sentadas en una cama charlando con una perrita marrón",
    resumen: "Empezaron como hogar de tránsito y a las dos semanas ya no se imaginaban la casa sin ella.",
    cita: "Fuimos tránsito “por unos días”. Spoiler: nos quedamos con Miel." },
  { id: "h4", titulo: "Bigote y Pepa, la dupla", quienes: "Familia Gómez", mascota: "Bigote y Pepa", especie: "gato", refugio: "gatuno", fecha: "Marzo 2026", foto: "/img/historias/juntos.jpg", alt: "Gato atigrado y perro blanco y negro descansando juntos en el pasto",
    resumen: "Les dijeron que un gato y un perro no iban a convivir. Con una presentación de a poco, hoy duermen pegados.",
    cita: "La ficha decía “se lleva bien con perros” y fue verdad. Esa info nos dio la confianza." },
  { id: "h5", titulo: "Michi aprendió a confiar", quienes: "Paula", mascota: "Michi", especie: "gato", refugio: "gatuno", fecha: "Febrero 2026", foto: "/img/historias/high-five.jpg", alt: "Mano de una persona chocando la pata de un gato atigrado",
    resumen: "Era el gato más tímido del hogar. Paula tuvo paciencia y hoy le choca los cinco.",
    cita: "Los primeros días no salía de abajo de la cama. Hoy es el dueño de la casa." },
  { id: "h6", titulo: "Oso y sus paseos en auto", quienes: "Hernán", mascota: "Oso", especie: "perro", refugio: "patitas", fecha: "Enero 2026", foto: "/img/historias/sofa.jpg", alt: "Perro de pelo largo marrón asomado por la ventanilla de un auto",
    resumen: "Le tenía miedo a todo. Hoy su momento favorito del día es ir a buscar a los chicos a la escuela.",
    cita: "El seguimiento del refugio nos ayudó muchísimo los primeros meses." }
];
