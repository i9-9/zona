import type { SiteLang } from "@/data/i18n/lang";

export type ShopLang = SiteLang;

export const shopCopy = {
  es: {
    shopTag: "GZ-01 / SHOP",
    intro: "FW26 // GROUND ZERO",
    inventory: "INVENTARIO",
    items: "ITEMS",
    backHub: "← HUB",
    backShop: "← SHOP",
    cart: "CARRITO",
    soldOut: "AGOTADO",
    addToCart: "[ AGREGAR ]",
    inStock: "DISPONIBLE",
    unavailable: "NO DISPONIBLE",
    shipping: "ENVÍO",
    shippingNote: "OCA — domicilio, todo Argentina",
    selectProvince: "Provincia",
    subtotal: "SUBTOTAL",
    total: "TOTAL",
    checkout: "[ CHECKOUT ]",
    placeOrder: "[ CONFIRMAR PEDIDO ]",
    emptyCart: "Carrito vacío.",
    continueShopping: "← Seguir comprando",
    orderConfirmed: "PEDIDO CONFIRMADO",
    orderId: "Nº de pedido",
    orderPending: "Recibirás instrucciones de pago por email.",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    address: "Dirección",
    city: "Ciudad",
    postalCode: "CP",
    qty: "CANT",
    remove: "Quitar",
    shippingDetails: "Datos de envío",
  },
  en: {
    shopTag: "GZ-01 / SHOP",
    intro: "FW26 // GROUND ZERO",
    inventory: "INVENTORY",
    items: "ITEMS",
    backHub: "← HUB",
    backShop: "← SHOP",
    cart: "CART",
    soldOut: "SOLD OUT",
    addToCart: "[ ADD ]",
    inStock: "IN STOCK",
    unavailable: "UNAVAILABLE",
    shipping: "SHIPPING",
    shippingNote: "OCA — home delivery, all Argentina",
    selectProvince: "Province",
    subtotal: "SUBTOTAL",
    total: "TOTAL",
    checkout: "[ CHECKOUT ]",
    placeOrder: "[ PLACE ORDER ]",
    emptyCart: "Cart is empty.",
    continueShopping: "← Continue shopping",
    orderConfirmed: "ORDER CONFIRMED",
    orderId: "Order ID",
    orderPending: "You will receive payment instructions by email.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    postalCode: "ZIP",
    qty: "QTY",
    remove: "Remove",
    shippingDetails: "Shipping details",
  },
} as const;

export function t(lang: ShopLang) {
  return shopCopy[lang];
}

export function formatARS(amount: number, lang: ShopLang): string {
  const formatted = amount.toLocaleString("es-AR");
  return lang === "es" ? `${formatted} ARS` : `ARS ${formatted}`;
}
