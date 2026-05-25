"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home",         href: "/",           highlight: false },
  { label: "Rentals",      href: "/rentals",     highlight: false },
  { label: "Concierge",    href: "/#services",   highlight: false },
  { label: "Testimonials", href: "/#reviews",    highlight: false },
  { label: "Contact",      href: "/contact",     highlight: false },
  { label: "Volunteer",    href: "/volunteer",   highlight: true  },
];

/**
 * Logo rendered by cropping the central emblem+text portion of the wide SVG.
 * The full SVG viewBox is 0 0 3089.9 636.8. The stacked "FOR RENT / BARBADOS"
 * emblem sits roughly in the centre third: x≈900 to x≈2200, full height.
 * We use an <img> with object-fit:none + object-position to crop, inside a
 * fixed-size container.
 */
function LogoSVG({ height = 70 }: { height?: number }) {
  // Render the full SVG at a height that makes the centre crop look right.
  // At height=70, the full width = 70 * (3089.9/636.8) ≈ 339px.
  // The centre third starts at ~113px and ends at ~226px in rendered space.
  // We show a 120px-wide window centred on the emblem.
  const fullWidth = Math.round(height * (3089.9 / 636.8));
  const cropWidth = Math.round(height * 1.8); // window width shown
  // Offset: centre of SVG minus half crop width
  const offsetX = Math.round(fullWidth / 2 - cropWidth / 2);

  return (
    <div
      style={{
        width: cropWidth,
        height: height,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <img
        src="/assets/logos/LOGO-FRB-10.svg"
        alt="For Rent Barbados"
        style={{
          height: height,
          width: fullWidth,
          position: "absolute",
          left: -offsetX,
          top: 0,
          display: "block",
        }}
      />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkBase: React.CSSProperties = {
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: 13,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#FFFFFF",
    padding: "10px 22px",
    textDecoration: "none",
    transition: "opacity 0.2s",
    whiteSpace: "nowrap",
  };

  const volunteerStyle: React.CSSProperties = {
    ...navLinkBase,
    color: "#000000",
    background: "#FFFFFF",
    padding: "8px 22px",
    letterSpacing: "2px",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "transparent",
      }}
    >
      {/* ── Desktop: two-row centred layout ── */}
      <div
        className="hidden md:block"
        style={{ textAlign: "center", paddingTop: 18, paddingBottom: 6 }}
      >
        {/* Row 1 — Logo centred */}
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}
        >
          <LogoSVG height={62} />
        </Link>

        {/* Row 2 — Nav centred */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={link.highlight ? volunteerStyle : navLinkBase}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Mobile: logo left + hamburger right ── */}
      <div
        className="flex md:hidden"
        style={{ alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <LogoSVG height={44} />
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "#FFFFFF",
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                  : "none"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className="md:hidden"
        style={{
          background: "#042E28",
          overflow: "hidden",
          maxHeight: menuOpen ? 400 : 0,
          transition: "max-height 0.3s ease",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: menuOpen ? "24px 0" : 0, gap: 20 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: link.highlight ? "#000000" : "#FFFFFF",
                background: link.highlight ? "#FFFFFF" : "transparent",
                padding: link.highlight ? "8px 20px" : "0",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
