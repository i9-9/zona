"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { LangToggle } from "@/components/LangToggle";
import { formatARS, t } from "@/data/i18n/shop";
import { site } from "@/data/site";
import type { ReactNode } from "react";

export function ShopShell({
  children,
  tag,
  backHref = "/",
  backLabel,
  footerLeft,
  footerRight,
}: {
  children: ReactNode;
  tag?: string;
  backHref?: string;
  backLabel?: string;
  footerLeft?: string;
  footerRight?: string;
}) {
  const { lang } = useLang();
  const { cartCount } = useShop();
  const copy = t(lang);
  const pathname = usePathname();
  const isCheckout = pathname === "/shop/checkout";

  return (
    <main className="hub shop">
      <div className="hub-glitch-band hub-glitch-top" aria-hidden="true" />

      <div className="hub-shell shop-shell">
        <header className="hub-header shop-header">
          <div className="hub-header-left">
            <span className="hub-tag">{copy.shopTag}</span>
            <span className="hub-tag hub-tag-dim">{tag ?? site.location}</span>
          </div>
          <div className="shop-header-actions">
            <LangToggle />
            {!isCheckout && (
              <Link href="/shop/cart" className="shop-cart-link">
                {copy.cart}
                {cartCount > 0 && <span className="shop-cart-count">{cartCount}</span>}
              </Link>
            )}
            <Link href={backHref} className="hub-tag shop-back">
              {backLabel ?? copy.backHub}
            </Link>
          </div>
        </header>

        {children}

        <footer className="hub-footer shop-footer">
          <span>{footerLeft ?? copy.inventory}</span>
          <div className="hub-footer-bar">
            <div className="hub-footer-fill" />
          </div>
          <span>{footerRight ?? site.location}</span>
        </footer>
      </div>

      <div className="hub-glitch-band hub-glitch-bottom" aria-hidden="true" />
    </main>
  );
}

export function Price({ amount }: { amount: number }) {
  const { lang } = useLang();
  return <>{formatARS(amount, lang)}</>;
}
