/**
 * Contenido de la presentación de branding.
 * Sustituye estos valores por los de tu PDF de branding.
 */

export const branding = {
  nombreMarca: "Tu Marca",
  tagline: "Tu tagline o eslogan",
  descripcion: "Breve descripción de la marca y su propuesta de valor.",

  colores: {
    primarios: [
      { nombre: "Principal", hex: "#1a1a2e", uso: "Fondos, textos principales" },
      { nombre: "Acento", hex: "#e94560", uso: "CTAs, destacados" },
    ],
    secundarios: [
      { nombre: "Claro", hex: "#f5f5f5", uso: "Fondos alternativos" },
      { nombre: "Oscuro", hex: "#0f0f1a", uso: "Footer, contraste" },
    ],
  },

  tipografia: {
    titulos: "Syne (display)",
    cuerpo: "IBM Plex Mono",
    ejemplos: ["Aa Bb Cc 123", "Peso Light", "Peso Regular", "Peso Bold"],
  },

  logo: {
    descripcion: "El logotipo representa [tu descripción]. Debe mantener espacio de respiro y no deformarse.",
    usosCorrectos: ["Sobre fondo claro", "Sobre fondo oscuro", "Tamaño mínimo"],
    usosIncorrectos: ["Estirar o comprimir", "Cambiar colores", "Añadir efectos"],
  },

  video: {
    titulo: "Nuestra historia",
    descripcion: "Video de presentación de la marca.",
    /** Ruta local: /videos/presentacion.mp4 o URL externa */
    src: "/videos/presentacion.mp4",
    poster: "/videos/poster.jpg",
    fallbackUrl: "", // opcional: enlace a Vimeo/YouTube si no hay archivo
  },

  contacto: {
    email: "hola@tumarca.com",
    web: "https://tumarca.com",
  },
} as const;

export type Branding = typeof branding;
