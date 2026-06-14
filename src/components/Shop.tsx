import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { site } from "@/data/site";

export function Shop() {
  return (
    <main className="hub shop">
      <div className="hub-glitch-band hub-glitch-top" aria-hidden="true" />

      <div className="hub-shell shop-shell">
        <header className="hub-header">
          <div className="hub-header-left">
            <span className="hub-tag">GZ-01 / SHOP</span>
            <span className="hub-tag hub-tag-dim">{site.location}</span>
          </div>
          <Link href="/" className="hub-tag shop-back">
            ← HUB
          </Link>
        </header>

        <div className="shop-panel">
          <p className="shop-intro">FW26 // GROUND ZERO</p>

          <ul className="shop-list">
            {products.map((product) => (
              <li key={product.id} className="shop-item">
                <Link href={`/shop/${product.id}`} className="shop-item-link">
                  <div className="shop-item-img">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="(max-width: 720px) 120px, 33vw"
                      className="shop-img"
                    />
                  </div>
                  <div className="shop-item-info">
                    <p className="shop-item-code">{product.code}</p>
                    <p className="shop-item-name">{product.name}</p>
                    <p className="shop-item-price">{product.price}</p>
                    {product.status === "sold_out" && (
                      <span className="shop-sold">SOLD OUT</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <footer className="hub-footer shop-footer">
          <span>INVENTORY</span>
          <div className="hub-footer-bar">
            <div className="hub-footer-fill" />
          </div>
          <span>{products.length} ITEMS</span>
        </footer>
      </div>

      <div className="hub-glitch-band hub-glitch-bottom" aria-hidden="true" />
    </main>
  );
}
