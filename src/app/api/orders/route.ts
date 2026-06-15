import { NextResponse } from "next/server";
import { getProductById } from "@/data/products";
import { getShippingForProvince } from "@/data/shipping";
import { site } from "@/data/site";

type OrderItem = { productId: string; qty: number };

type OrderBody = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
  };
  items: OrderItem[];
  province: string;
  lang: "es" | "en";
};

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GZ-${ts}-${rand}`;
}

export async function POST(request: Request) {
  let body: OrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { customer, items, province } = body;
  if (!customer?.email || !customer?.name || !items?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const shipping = getShippingForProvince(province);
  if (!shipping) {
    return NextResponse.json({ error: "Invalid province" }, { status: 400 });
  }

  let subtotal = 0;
  const lineItems = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product || product.status !== "available") {
      return NextResponse.json(
        { error: `Product unavailable: ${item.productId}` },
        { status: 400 },
      );
    }
    if (item.qty < 1 || item.qty > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    subtotal += product.priceAmount * item.qty;
    lineItems.push({
      code: product.code,
      name: product.copy.es.name,
      qty: item.qty,
      unitPrice: product.priceAmount,
      lineTotal: product.priceAmount * item.qty,
    });
  }

  const total = subtotal + shipping.price;
  const orderId = generateOrderId();

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    customer,
    items: lineItems,
    shipping: {
      carrier: shipping.carrier,
      service: shipping.service,
      zone: shipping.id,
      zoneLabel: shipping.label.es,
      price: shipping.price,
    },
    subtotal,
    total,
  };

  // TODO: persist order (DB) + Mercado Pago preference + email notification
  console.log("[ORDER]", JSON.stringify(order, null, 2));

  return NextResponse.json({
    orderId,
    total,
    email: site.email,
  });
}
