import type { SiteLang } from "@/data/i18n/lang";

export type ProductCopy = {
  name: string;
  description: string;
  details: string[];
};

export type Product = {
  id: string;
  code: string;
  priceAmount: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
  status: "available" | "sold_out";
  copy: Record<SiteLang, ProductCopy>;
};

export const products: Product[] = [
  {
    id: "cap-27",
    code: "GZ-CAP-27",
    priceAmount: 45000,
    image: "/newimages/cap-27.jpg",
    imageWidth: 504,
    imageHeight: 341,
    status: "available",
    copy: {
      es: {
        name: "CAP-01 — Sphere",
        description: "Gorra estructurada. Gráfica esfera — mapa incompleto.",
        details: ["Algodón", "Ajuste estándar", "Buenos Aires"],
      },
      en: {
        name: "CAP-01 — Sphere",
        description: "Structured cap. Sphere graphic — incomplete map.",
        details: ["Cotton", "Standard fit", "Buenos Aires"],
      },
    },
  },
  {
    id: "cap-28",
    code: "GZ-CAP-28",
    priceAmount: 45000,
    image: "/newimages/cap-28.jpg",
    imageWidth: 504,
    imageHeight: 356,
    status: "available",
    copy: {
      es: {
        name: "CAP-01 — Stack",
        description: "Gorra estructurada. Gráfica stack — capas urbanas.",
        details: ["Algodón", "Ajuste estándar", "Buenos Aires"],
      },
      en: {
        name: "CAP-01 — Stack",
        description: "Structured cap. Stack graphic — urban layers.",
        details: ["Cotton", "Standard fit", "Buenos Aires"],
      },
    },
  },
  {
    id: "cap-29",
    code: "GZ-TEE-29",
    priceAmount: 38000,
    image: "/newimages/cap-29.jpg",
    imageWidth: 504,
    imageHeight: 347,
    status: "available",
    copy: {
      es: {
        name: "TEE-01 — Surface",
        description: "Remera oversize. Gráfica tee — superficie de sentido.",
        details: ["Algodón", "Corte relajado", "Buenos Aires"],
      },
      en: {
        name: "TEE-01 — Surface",
        description: "Oversize tee. Surface graphic — meaning as texture.",
        details: ["Cotton", "Relaxed fit", "Buenos Aires"],
      },
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductCopy(product: Product, lang: SiteLang): ProductCopy {
  return product.copy[lang];
}
