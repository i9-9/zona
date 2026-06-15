/**
 * Tarifas referencia OCA domicilio (Argentina).
 * Ajustá montos en shippingZones según tu acuerdo con OCA.
 */

export type ShippingZoneId =
  | "caba"
  | "gba"
  | "buenos_aires_interior"
  | "centro_litoral"
  | "cuyo"
  | "norte"
  | "patagonia";

export type ShippingZone = {
  id: ShippingZoneId;
  price: number;
  carrier: "OCA";
  service: "domicilio";
  label: { es: string; en: string };
};

export const shippingZones: Record<ShippingZoneId, ShippingZone> = {
  caba: {
    id: "caba",
    price: 4500,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "CABA", en: "CABA" },
  },
  gba: {
    id: "gba",
    price: 5500,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "GBA — Gran Buenos Aires", en: "GBA — Greater Buenos Aires" },
  },
  buenos_aires_interior: {
    id: "buenos_aires_interior",
    price: 6500,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "Buenos Aires — interior", en: "Buenos Aires — interior" },
  },
  centro_litoral: {
    id: "centro_litoral",
    price: 7500,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "Centro / Litoral", en: "Central / Littoral" },
  },
  cuyo: {
    id: "cuyo",
    price: 8000,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "Cuyo", en: "Cuyo" },
  },
  norte: {
    id: "norte",
    price: 9000,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "NOA / NEA", en: "Northwest / Northeast" },
  },
  patagonia: {
    id: "patagonia",
    price: 11000,
    carrier: "OCA",
    service: "domicilio",
    label: { es: "Patagonia", en: "Patagonia" },
  },
};

/** Provincias argentinas → zona OCA */
export const provinceToZone: Record<string, ShippingZoneId> = {
  "Ciudad Autónoma de Buenos Aires": "caba",
  "Buenos Aires": "gba",
  "Catamarca": "norte",
  "Chaco": "norte",
  "Chubut": "patagonia",
  "Córdoba": "centro_litoral",
  "Corrientes": "centro_litoral",
  "Entre Ríos": "centro_litoral",
  "Formosa": "norte",
  "Jujuy": "norte",
  "La Pampa": "centro_litoral",
  "La Rioja": "norte",
  "Mendoza": "cuyo",
  "Misiones": "norte",
  "Neuquén": "patagonia",
  "Río Negro": "patagonia",
  "Salta": "norte",
  "San Juan": "cuyo",
  "San Luis": "cuyo",
  "Santa Cruz": "patagonia",
  "Santa Fe": "centro_litoral",
  "Santiago del Estero": "norte",
  "Tierra del Fuego": "patagonia",
  "Tucumán": "norte",
};

export const provinces = Object.keys(provinceToZone).sort((a, b) =>
  a.localeCompare(b, "es"),
);

export function getShippingForProvince(province: string): ShippingZone | null {
  const zoneId = provinceToZone[province];
  if (!zoneId) return null;
  return shippingZones[zoneId];
}
