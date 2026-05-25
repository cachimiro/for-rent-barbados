"use client";

import Link from "next/link";


export default function Footer() {
  return (
    <footer>
      {/* Newsletter section — black bg, 50px padding */}
      <div style={{ background: "#000000", padding: "50px 50px" }} className="px-5 md:px-[50px]">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Tagline */}
            <div>
              <h2 style={{ fontFamily: '"Times New Roman", serif', fontSize: "clamp(1.5rem, 3vw, 48px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 4 }}>
                Stay Updated on New
              </h2>
              <h2 style={{ fontFamily: '"Times New Roman", serif', fontSize: "clamp(1.5rem, 3vw, 48px)", fontWeight: 900, fontStyle: "italic", color: "#FFFFFF", lineHeight: 1.2, marginBottom: 16 }}>
                Homes &amp; Exclusive Deals
              </h2>
              <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 20, fontWeight: 400, color: "#FFFFFF", lineHeight: "1.5", opacity: 0.85 }}>
                Subscribe to our newsletter for early access to new listings, special offers, and the latest editorial insights.
              </p>
            </div>

            {/* Newsletter form */}
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} />
              <input
                type="email"
                required
                placeholder="Your email *"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#FFFFFF",
                  padding: "12px 16px",
                  fontFamily: "var(--font-spinnaker), sans-serif",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "transparent",
                  border: "1px solid #FFFFFF",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "4.2px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  transition: "all 0.3s",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tagline + nav row — white bg, 50px padding, top 1px #707070 border */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #707070", padding: "50px 50px" }} className="px-5 md:px-[50px]">
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          {/* Tagline */}
          <div>
            <span style={{ fontFamily: '"Times New Roman", serif', fontSize: 30, fontWeight: 500, textTransform: "uppercase", letterSpacing: "5px", color: "#000000" }}>
              Inspired Stays. Lasting Moments.
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "0 8px" }}>
            {[
              { label: "Home", href: "/" },
              { label: "Rentals", href: "/rentals" },
              { label: "Contact", href: "/contact" },
              { label: "Terms & Conditions", href: "/terms-conditions" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  padding: "4px 8px",
                  background: "#000000",
                  marginBottom: 4,
                  display: "inline-block",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright bar — white bg, 10px padding */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #EAEAEA", padding: "10px 50px" }} className="px-5 md:px-[50px]">
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: "Inter, var(--font-roboto), sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#000000", lineHeight: "30px" }}>
            © 2025 For Rent Barbados.{" "}
            <Link href="/terms-conditions" style={{ color: "#000000", textDecoration: "none" }}>
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
