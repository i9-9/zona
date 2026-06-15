"use client";

import Image from "next/image";
import Link from "next/link";
import { products, getProductCopy } from "@/data/products";
import { t } from "@/data/i18n/shop";
import { useLang } from "@/context/LangContext";
import { Price, ShopShell } from "@/components/ShopShell";

export function Shop() {
  const { lang } = useLang();
  const copy = t(lang);

  return (
    <ShopShell footerRight={`${products.length} ${copy.items}`}>
      <div className="shop-panel">
        <p className="shop-intro">{copy.intro}</p>

        <ul className="shop-list">
          {products.map((product) => {
            const pc = getProductCopy(product, lang);
            return (
              <li key={product.id} className="shop-item">
                <Link href={`/shop/${product.id}`} className="shop-item-link">
                  <div className="shop-item-img">
                    <Image
                      src={product.image}
                      alt={pc.name}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="(max-width: 720px) 120px, 33vw"
                      className="shop-img"
                    />
                  </div>
                  <div className="shop-item-info">
                    <p className="shop-item-code">{product.code}</p>
                    <p className="shop-item-name">{pc.name}</p>
                    <p className="shop-item-price">
                      <Price amount={product.priceAmount} />
                    </p>
                    {product.status === "sold_out" && (
                      <span className="shop-sold">{copy.soldOut}</span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </ShopShell>
  );
}
