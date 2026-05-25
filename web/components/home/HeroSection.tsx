"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const VIDEO_URL = "https://bkqnviewrnafvvkqkhej.supabase.co/storage/v1/object/public/media/hero-video.mp4";
const POSTER_URL = "/assets/azzurro5-7-scaled.jpg";

export default function HeroSection() {
  const router = useRouter();
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults]     = useState("2");
  const [children, setChildren] = useState("0");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, adults, children });
    router.push(`/rentals?${params.toString()}`);
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER_URL}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
        {/* Fallback image for browsers that don't support video */}
        <Image src={POSTER_URL} alt="Barbados luxury villa" fill priority className="object-cover" sizes="100vw" />
      </video>

      {/* Dark overlay — rgba(0,0,0,0.4) matching original */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1 }} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 900,
          padding: "0 20px",
        }}
      >
        {/* Hero headline — Times New Roman, 60px, weight 200 */}
        <h1
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: "clamp(2rem, 5vw, 60px)",
            fontWeight: 200,
            textTransform: "capitalize",
            lineHeight: 1.1,
            color: "#FFFFFF",
            marginBottom: 64,
          }}
        >
          Escape ordinary, stay extraordinary.
        </h1>

        {/* Booking form */}
        <form
          onSubmit={handleSearch}
          style={{
            width: "100%",
            maxWidth: 760,
            background: "rgba(0,0,0,0.75)",
            border: "5px solid transparent",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
            className="grid-cols-2 md:grid-cols-4"
          >
            {/* Check-in */}
            <div style={{ padding: "16px", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                Check-in <span style={{ color: "#FFBC7D" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#FFFFFF", fontSize: 13, fontFamily: "var(--font-spinnaker)", outline: "none", width: "100%", colorScheme: "dark" } as React.CSSProperties}
              />
            </div>
            {/* Check-out */}
            <div style={{ padding: "16px", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                Check-out <span style={{ color: "#FFBC7D" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#FFFFFF", fontSize: 13, fontFamily: "var(--font-spinnaker)", outline: "none", width: "100%", colorScheme: "dark" } as React.CSSProperties}
              />
            </div>
            {/* Adults */}
            <div style={{ padding: "16px", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                Adults
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#FFFFFF", fontSize: 13, fontFamily: "var(--font-spinnaker)", outline: "none", width: "100%" }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} style={{ background: "#000", color: "#fff" }}>{n}</option>
                ))}
              </select>
            </div>
            {/* Children */}
            <div style={{ padding: "16px" }}>
              <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                Children
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#FFFFFF", fontSize: 13, fontFamily: "var(--font-spinnaker)", outline: "none", width: "100%" }}
              >
                {Array.from({ length: 7 }, (_, i) => i).map((n) => (
                  <option key={n} value={n} style={{ background: "#000", color: "#fff" }}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit row */}
          <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <button
              type="submit"
              style={{
                background: "#FFFFFF",
                border: "none",
                fontFamily: "var(--font-poppins)",
                fontSize: 14,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "4.2px",
                color: "#000000",
                padding: "10px 28px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Check Availability
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
