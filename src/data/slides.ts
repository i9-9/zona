/**
 * Contenido extraído del PDF Z.pdf — 15 diapositivas.
 */

export type SlideType = "portada" | "texto" | "bullets" | "divisor" | "logo" | "gracias";

export type Slide =
  | { type: "portada"; titulo: string; subtitulo?: string; lugar: string; fecha: string }
  | { type: "texto"; titulo: string; parrafos: string[]; lugar: string; fecha: string }
  | { type: "bullets"; titulo: string; items: string[]; parrafo?: string; lugar: string; fecha: string }
  | { type: "divisor"; linea: string; lugar: string; etiqueta: string; fecha: string }
  | { type: "logo"; lineas: string[]; lugar?: string; fecha?: string }
  | { type: "gracias" };

export const slides: Slide[] = [
  {
    type: "portada",
    titulo: "ZONA",
    subtitulo: "Identidad",
    lugar: "BUENOS AIRES",
    fecha: "FEB 2026",
  },
  {
    type: "texto",
    titulo: "Introducción",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    parrafos: [
      "ZONA nombra un estado del presente. Un espacio donde lo urbano se suspende y se vuelve legible.",
      "No refiere al futuro ni funciona como advertencia. Describe lo que ya está ocurriendo.",
      "La distopía dejó de ser una proyección: es entorno.",
    ],
  },
  {
    type: "texto",
    titulo: "Concepto",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    parrafos: [
      "ZONA es el territorio donde las cosas no se resuelven de inmediato. Donde detenerse también es una forma de avanzar.",
      "El espacio no se llena ni se corrige: se habita. Las decisiones no siempre se toman; muchas veces emergen.",
      "ZONA trabaja con esa lógica de suspensión, entendiendo los problemas como posibilidades y el proceso como parte esencial de la forma.",
      "No hay separación entre lo que sucede y la manera en que lo atravesamos.",
    ],
  },
  {
    type: "texto",
    titulo: "Qué es Zona?",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    parrafos: [
      "ZONA es una marca de indumentaria urbana construida desde la experiencia de la ciudad contemporánea: Erosión, infraestructura, tecnología, desgaste.",
      "Las prendas funcionan como superficies de sentido. No comunican mensajes cerrados ni dependen de discursos externos. Acompañan el tránsito cotidiano de quien las viste.",
      "Vestir ZONA es asumir una posición frente al entorno urbano actual: sin promesas, sin idealización.",
    ],
  },
  {
    type: "bullets",
    titulo: "Enfoque",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    items: [
      "Proceso antes que resultado",
      "Identidad antes que tendencia",
      "Funcionalidad antes que exceso",
    ],
    parrafo:
      "Algodón como material base. Gráfica como condensación conceptual. Comodidad real para habitar la ciudad en distintos contextos. Cada decisión responde a una lógica clara, sin ornamentación innecesaria.",
  },
  {
    type: "texto",
    titulo: "Gráfica y Propuesta",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    parrafos: [
      "Las gráficas de ZONA se inspiran en paisajes urbanos intersticiales: asfalto, vacío, impacto, colisión, espectro.",
      "No ilustran ideas ni explican conceptos. Operan como zonas abiertas de lectura.",
      "Cada diseño funciona como un mapa incompleto, permitiendo que quien lo use proyecte su propia interpretación del entorno.",
      "La marca inicia en pequeña escala, con pocos diseños que establecen un territorio conceptual preciso.",
      "Cada prenda funciona como un enclave personal dentro del flujo urbano: un espacio propio, portable, silencioso.",
      "ZONA no busca resolver la ciudad. La habita.",
    ],
  },
  {
    type: "bullets",
    titulo: "Zona",
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
    items: [
      "Indumentaria urbana.",
      "El presente como estado permanente.",
      "Identidad en tránsito.",
      "Proceso antes que forma.",
    ],
  },
  {
    type: "divisor",
    linea: "L I M I N A L",
    lugar: "BUENOS AIRES",
    etiqueta: "INTRODUCCION",
    fecha: "Febrero 2026",
  },
  {
    type: "logo",
    lineas: ["INTRODUCCION", "Febrero 2026"],
    lugar: "BUENOS AIRES",
    fecha: "Febrero 2026",
  },
  {
    type: "logo",
    lineas: ["INTRODUCCION", "Febrero 2026"],
    lugar: "BUENOS AIRES",
  },
  {
    type: "logo",
    lineas: ["ZONA ® LIMINAL", "BUENOS AIRES: AR", "-34.5919078909744, -58.43338550682904", "ZONA"],
  },
  {
    type: "logo",
    lineas: ["ZONA", "LIMINAL", "ZONA LIMINAL", "2026", "BUENOS AIRES"],
  },
  {
    type: "logo",
    lineas: ["ZONA LIMINAL", "BUENOS AIRES"],
    lugar: "BUENOS AIRES",
    fecha: "INTRODUCCION  Febrero 2026",
  },
  {
    type: "logo",
    lineas: ["BUENOS AIRES", "INTRODUCCION", "Febrero 2026"],
  },
  {
    type: "gracias",
  },
];
