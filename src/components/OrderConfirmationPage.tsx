"use client";

import Link from "next/link";
import { t } from "@/data/i18n/shop";
import { useLang } from "@/context/LangContext";
import { ShopShell } from "@/components/ShopShell";

export function OrderConfirmationPage({ orderId }: { orderId: string }) {
  const { lang } = useLang();
  const copy = t(lang);

  return (
    <ShopShell backHref="/shop" backLabel={copy.backShop}>
      <div className="shop-panel shop-order-panel">
        <h1 className="product-name">{copy.orderConfirmed}</h1>
        <p className="shop-order-id">
          {copy.orderId}: <strong>{orderId}</strong>
        </p>
        <p className="product-desc">{copy.orderPending}</p>
        <Link href="/shop" className="shop-order">
          {copy.continueShopping}
        </Link>
      </div>
    </ShopShell>
  );
}
