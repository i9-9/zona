import Image from "next/image";
import Link from "next/link";
import { hubImages, site } from "@/data/site";

const LINKS = [
  { label: "Instagram", href: site.instagram, external: true },
  { label: "Presentation", href: "/presentation", external: false },
  { label: "Contact", href: `mailto:${site.email}`, external: true },
] as const;

const STATUS = [
  { label: "TOPO ENGINE", val: "ONLINE" },
  { label: "RF LINK", val: "LOCKED" },
  { label: "GRID NODES", val: "5/5" },
  { label: "SIGNAL", val: "ACTIVE" },
] as const;

export function Hub() {
  return (
    <main className="hub">
      <div className="hub-glitch-band hub-glitch-top" aria-hidden="true" />

      <div className="hub-shell">
        <header className="hub-header">
          <div className="hub-header-left">
            <span className="hub-tag">GZ-01 / HUB</span>
            <span className="hub-tag hub-tag-dim">{site.location}</span>
          </div>
          <div className="hub-header-right">
            <span className="hub-tag hub-tag-live">● ONLINE</span>
            <span className="hub-tag hub-tag-dim">34.60°S 58.38°W</span>
          </div>
        </header>

        <div className="hub-visual">
          {hubImages.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              priority
              className="hub-img"
            />
          ))}
        </div>

        <div className="hub-panel">
          <div className="hub-panel-col hub-panel-main">
            <h1 className="hub-logo">ZONA</h1>

            <nav className="hub-nav" aria-label="Site links">
              {LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="hub-link"
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  >
                    <span className="hub-link-bracket">[</span>
                    {link.label.toUpperCase()}
                    <span className="hub-link-bracket">]</span>
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className="hub-link">
                    <span className="hub-link-bracket">[</span>
                    {link.label.toUpperCase()}
                    <span className="hub-link-bracket">]</span>
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="hub-panel-divider" aria-hidden="true" />

          <div className="hub-panel-col hub-panel-side">
            <p className="hub-side-title">SYS STATUS</p>
            {STATUS.map((row) => (
              <div key={row.label} className="hub-status-line">
                <span>{row.label}</span>
                <span className="hub-status-dots" />
                <span className="hub-status-val">{row.val}</span>
              </div>
            ))}
            <div className="hub-side-gap" />
            <p className="hub-side-line">INPUT: BIOMETRIC</p>
            <p className="hub-side-line">MODE: GROUND ZERO</p>
            <p className="hub-side-line">BUILD: GODLESS</p>
            <p className="hub-side-line hub-side-dim">{site.instagramHandle}</p>
          </div>
        </div>

        <footer className="hub-footer">
          <span>SELECT ROUTE</span>
          <div className="hub-footer-bar">
            <div className="hub-footer-fill" />
          </div>
          <span>READY</span>
        </footer>
      </div>

      <div className="hub-glitch-band hub-glitch-bottom" aria-hidden="true" />
    </main>
  );
}
