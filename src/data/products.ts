import { site } from "@/data/site";

export type Product = {
  id: string;
  name: string;
  code: string;
  price: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  status: "available" | "sold_out";
  description: string;
  details: string[];
};

export const products: Product[] = [
  {
    id: "cap-27",
    name: "CAP-01 — Sphere",
    code: "GZ-CAP-27",
    price: "45.000 ARS",
    image: "/newimages/cap-27.jpg",
    imageWidth: 504,
    imageHeight: 357,
    status: "available",
    description: "Gorra estructurada. Gráfica esfera — mapa incompleto.",
    details: ["Algodón", "Ajuste estándar", "Buenos Aires"],
  },
  {
    id: "cap-28",
    name: "CAP-01 — Stack",
    code: "GZ-CAP-28",
    price: "45.000 ARS",
    image: "/newimages/cap-28.jpg",
    imageWidth: 504,
    imageHeight: 357,
    status: "available",
    description: "Gorra estructurada. Gráfica stack — capas urbanas.",
    details: ["Algodón", "Ajuste estándar", "Buenos Aires"],
  },
  {
    id: "cap-29",
    name: "CAP-01 — Tee",
    code: "GZ-CAP-29",
    price: "38.000 ARS",
    image: "/newimages/cap-29.jpg",
    imageWidth: 504,
    imageHeight: 357,
    status: "available",
    description: "Remera oversize. Gráfica tee — superficie de sentido.",
    details: ["Algodón", "Corte relajado", "Buenos Aires"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function orderMail(product: Product) {
  const subject = encodeURIComponent(`Pedido — ${product.code}`);
  const body = encodeURIComponent(
    `Hola,\n\nQuiero consultar por: ${product.name} (${product.code})\n\n`,
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
