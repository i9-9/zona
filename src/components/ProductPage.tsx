"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductCopy, type Product } from "@/data/products";
import { t } from "@/data/i18n/shop";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { Price, ShopShell } from "@/components/ShopShell";

export function ProductPage({ product }: { product: Product }) {
  const { lang } = useLang();
  const { addToCart } = useShop();
  const copy = t(lang);
  const pc = getProductCopy(product, lang);
  const router = useRouter();

  const handleAdd = () => {
    addToCart(product.id);
    router.push("/shop/cart");
  };

  return (
    <ShopShell tag={product.code} backHref="/shop" backLabel={copy.backShop}>
      <div className="shop-panel product-panel">
        <div className="product-layout">
          <div className="product-visual">
            <Image
              src={product.image}
              alt={pc.name}
              width={product.imageWidth}
              height={product.imageHeight}
              priority
              sizes="(max-width: 720px) 100vw, 50vw"
              className="product-img"
            />
          </div>

          <div className="product-info">
            <p className="shop-item-code">{product.code}</p>
            <h1 className="product-name">{pc.name}</h1>
            <p className="product-price">
              <Price amount={product.priceAmount} />
            </p>
            <p className="product-desc">{pc.description}</p>

            <ul className="product-details">
              {pc.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <p className="product-shipping-note">{copy.shippingNote}</p>

            {product.status === "available" ? (
              <button type="button" onClick={handleAdd} className="shop-order product-order">
                {copy.addToCart}
              </button>
            ) : (
              <span className="shop-sold">{copy.soldOut}</span>
            )}
          </div>
        </div>
      </div>
    </ShopShell>
  );
}
