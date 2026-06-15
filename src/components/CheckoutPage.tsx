"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { provinces, getShippingForProvince } from "@/data/shipping";
import { t, formatARS } from "@/data/i18n/shop";
import { getProductCopy } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { ShopShell } from "@/components/ShopShell";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
};

export function CheckoutPage() {
  const { lang } = useLang();
  const { cartProducts, subtotal, clearCart } = useShop();
  const copy = t(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: provinces[0] ?? "",
  });

  const shipping = form.province ? getShippingForProvince(form.province) : null;
  const shippingAmount = shipping?.price ?? 0;
  const total = subtotal + shippingAmount;

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartProducts.length === 0) return;
    if (!shipping) {
      setError(lang === "es" ? "Seleccioná una provincia válida." : "Select a valid province.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: cartProducts.map(({ product, qty }) => ({
            productId: product.id,
            qty,
          })),
          province: form.province,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");

      clearCart();
      router.push(`/shop/order/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <ShopShell backHref="/shop/cart" backLabel={copy.cart}>
        <div className="shop-panel shop-cart-panel">
          <p className="shop-empty">{copy.emptyCart}</p>
          <Link href="/shop" className="shop-order">
            {copy.continueShopping}
          </Link>
        </div>
      </ShopShell>
    );
  }

  return (
    <ShopShell backHref="/shop/cart" backLabel={copy.cart}>
      <div className="shop-panel shop-checkout-panel">
        <form onSubmit={handleSubmit} className="shop-checkout-form">
          <div className="shop-checkout-grid">
            <fieldset className="shop-fieldset">
              <legend>{copy.shippingDetails}</legend>
              <label className="shop-label">{copy.name}</label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.email}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.phone}</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.address}</label>
              <input
                required
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.city}</label>
              <input
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.postalCode}</label>
              <input
                required
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                className="shop-input"
              />
              <label className="shop-label">{copy.selectProvince}</label>
              <select
                required
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="shop-input shop-select"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </fieldset>

            <div className="shop-checkout-summary">
              <p className="shop-side-title">{copy.cart}</p>
              <ul className="shop-checkout-items">
                {cartProducts.map(({ product, qty }) => {
                  const pc = getProductCopy(product, lang);
                  return (
                    <li key={product.id} className="shop-checkout-item">
                      <span>
                        {pc.name} × {qty}
                      </span>
                      <span>{formatARS(product.priceAmount * qty, lang)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="shop-summary-row">
                <span>{copy.subtotal}</span>
                <span>{formatARS(subtotal, lang)}</span>
              </div>
              <div className="shop-summary-row">
                <span>
                  {copy.shipping}
                  {shipping && (
                    <span className="shop-shipping-zone">
                      {" "}
                      — {shipping.label[lang]} (OCA)
                    </span>
                  )}
                </span>
                <span>{formatARS(shippingAmount, lang)}</span>
              </div>
              <div className="shop-summary-row shop-summary-total">
                <span>{copy.total}</span>
                <span>{formatARS(total, lang)}</span>
              </div>
              {error && <p className="shop-error">{error}</p>}
              <button type="submit" disabled={loading} className="shop-order shop-checkout-btn">
                {loading ? "..." : copy.placeOrder}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ShopShell>
  );
}
