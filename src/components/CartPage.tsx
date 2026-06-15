"use client";

import Image from "next/image";
import Link from "next/link";
import { getProductCopy } from "@/data/products";
import { t } from "@/data/i18n/shop";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { Price, ShopShell } from "@/components/ShopShell";

export function CartPage() {
  const { lang } = useLang();
  const { cartProducts, subtotal, setQty, removeFromCart } = useShop();
  const copy = t(lang);

  if (cartProducts.length === 0) {
    return (
      <ShopShell backHref="/shop" backLabel={copy.backShop}>
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
    <ShopShell backHref="/shop" backLabel={copy.backShop}>
      <div className="shop-panel shop-cart-panel">
        <ul className="shop-cart-list">
          {cartProducts.map(({ product, qty }) => {
            const pc = getProductCopy(product, lang);
            return (
              <li key={product.id} className="shop-cart-line">
                <Link href={`/shop/${product.id}`} className="shop-cart-line-img">
                  <Image
                    src={product.image}
                    alt={pc.name}
                    width={product.imageWidth}
                    height={product.imageHeight}
                    sizes="80px"
                    className="shop-img"
                  />
                </Link>
                <div className="shop-cart-line-info">
                  <p className="shop-item-code">{product.code}</p>
                  <p className="shop-item-name">{pc.name}</p>
                  <p className="shop-item-price">
                    <Price amount={product.priceAmount} />
                  </p>
                  <div className="shop-cart-line-actions">
                    <label className="shop-qty-label">
                      {copy.qty}
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={qty}
                        onChange={(e) =>
                          setQty(product.id, parseInt(e.target.value, 10) || 1)
                        }
                        className="shop-qty-input"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="shop-remove"
                    >
                      {copy.remove}
                    </button>
                  </div>
                </div>
                <p className="shop-cart-line-total">
                  <Price amount={product.priceAmount * qty} />
                </p>
              </li>
            );
          })}
        </ul>

        <div className="shop-cart-summary">
          <div className="shop-summary-row">
            <span>{copy.subtotal}</span>
            <span>
              <Price amount={subtotal} />
            </span>
          </div>
          <Link href="/shop/checkout" className="shop-order shop-checkout-btn">
            {copy.checkout}
          </Link>
        </div>
      </div>
    </ShopShell>
  );
}
