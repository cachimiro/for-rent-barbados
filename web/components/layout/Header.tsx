"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "Rentals",      href: "/rentals" },
  { label: "Concierge",    href: "/#services" },
  { label: "Testimonials", href: "/#reviews" },
  { label: "Contact",      href: "/contact" },
  { label: "Volunteer",    href: "/volunteer" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#FFFFFF",
        transition: "box-shadow 0.3s",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 80,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <Image
            src="/assets/logos/LOGO-FRB-10.svg"
            alt="For Rent Barbados"
            width={180}
            height={54}
            priority
            style={{ height: 54, width: "auto" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 0 }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#000000",
                padding: "15px 15px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#042E28")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
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
                background: "#000",
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 1 ? "opacity: 0"
                  : "rotate(-45deg) translate(5px, -5px)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
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
                color: "#FFFFFF",
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
