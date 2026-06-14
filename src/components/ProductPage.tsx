import Image from "next/image";
import Link from "next/link";
import { orderMail, type Product } from "@/data/products";
import { site } from "@/data/site";

export function ProductPage({ product }: { product: Product }) {
  return (
    <main className="hub shop">
      <div className="hub-glitch-band hub-glitch-top" aria-hidden="true" />

      <div className="hub-shell shop-shell">
        <header className="hub-header">
          <div className="hub-header-left">
            <span className="hub-tag">GZ-01 / SHOP</span>
            <span className="hub-tag hub-tag-dim">{product.code}</span>
          </div>
          <Link href="/shop" className="hub-tag shop-back">
            ← SHOP
          </Link>
        </header>

        <div className="shop-panel product-panel">
          <div className="product-layout">
            <div className="product-visual">
              <Image
                src={product.image}
                alt={product.name}
                width={product.imageWidth}
                height={product.imageHeight}
                priority
                sizes="(max-width: 720px) 100vw, 50vw"
                className="product-img"
              />
            </div>

            <div className="product-info">
              <p className="shop-item-code">{product.code}</p>
              <h1 className="product-name">{product.name}</h1>
              <p className="product-price">{product.price}</p>
              <p className="product-desc">{product.description}</p>

              <ul className="product-details">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>

              {product.status === "available" ? (
                <a href={orderMail(product)} className="shop-order product-order">
                  [ PEDIR ]
                </a>
              ) : (
                <span className="shop-sold">SOLD OUT</span>
              )}
            </div>
          </div>
        </div>

        <footer className="hub-footer shop-footer">
          <span>{site.location}</span>
          <div className="hub-footer-bar">
            <div className="hub-footer-fill" />
          </div>
          <span>{product.status === "available" ? "IN STOCK" : "UNAVAILABLE"}</span>
        </footer>
      </div>

      <div className="hub-glitch-band hub-glitch-bottom" aria-hidden="true" />
    </main>
  );
}
