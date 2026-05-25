"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { properties } from "@/data/properties";
import type { Property } from "@/data/properties";

function PropertyCard({ property }: { property: Property }) {
  const startingPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));
  return (
    <Link
      href={`/accommodation/${property.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        style={{
          background: "#FFFFFF",
          overflow: "hidden",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
          <Image
            src={property.coverImage}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        {/* Info */}
        <div style={{ padding: "16px 0 24px 0" }}>
          <p
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 22,
              fontWeight: 400,
              color: "#363636",
              marginBottom: 4,
            }}
          >
            ${startingPrice}
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#888",
              }}
            >
              /night
            </span>
          </p>
          <h3
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 18,
              fontWeight: 400,
              textTransform: "uppercase",
              color: "#363636",
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {property.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 13,
              color: "#888",
              lineHeight: 1.6,
            }}
          >
            {property.guests} guests · {property.bedrooms} bedroom ·{" "}
            {property.beds} bed · {property.bathrooms} bath
          </p>
        </div>
      </div>
    </Link>
  );
}

function SearchBar({
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
}: {
  initialCheckIn: string;
  initialCheckOut: string;
  initialAdults: string;
  initialChildren: string;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults || "2");
  const [children, setChildren] = useState(initialChildren || "0");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, adults, children });
    router.push(`/rentals?${params.toString()}`);
  };

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.4)",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "var(--font-spinnaker), sans-serif",
    outline: "none",
    width: "100%",
    padding: "4px 0",
    colorScheme: "dark",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-poppins), sans-serif",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "rgba(255,255,255,0.65)",
    marginBottom: 6,
  };

  return (
    <div style={{ background: "#042E28", padding: "32px 0" }}>
      <div
        className="px-5 md:px-10 lg:px-[100px]"
        style={{ maxWidth: 1400, margin: "0 auto" }}
      >
        <h1
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: "clamp(1.8rem, 3vw, 3rem)",
            fontWeight: 500,
            color: "#FFFFFF",
            marginBottom: 28,
          }}
        >
          Availability Search
        </h1>
        <form onSubmit={handleSearch}>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ marginBottom: 20 }}
          >
            <div>
              <label style={labelStyle}>
                Check-in <span style={{ color: "#FFBC7D" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Check-out <span style={{ color: "#FFBC7D" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Adults</label>
              <select
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} style={{ background: "#042E28" }}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Children</label>
              <select
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {Array.from({ length: 7 }, (_, i) => i).map((n) => (
                  <option key={n} value={n} style={{ background: "#042E28" }}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            style={{
              background: "#FFFFFF",
              border: "none",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 13,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "4.2px",
              color: "#000000",
              padding: "10px 32px",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

function RentalsContent() {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = searchParams.get("adults") ?? "2";
  const children = searchParams.get("children") ?? "0";

  const totalGuests = parseInt(adults) + parseInt(children);

  const filtered =
    totalGuests > 0
      ? properties.filter((p) => p.guests >= totalGuests)
      : properties;

  return (
    <>
      <SearchBar
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults}
        initialChildren={children}
      />
      <main style={{ background: "#FFFFFF", padding: "60px 0 80px" }}>
        <div
          className="px-5 md:px-10 lg:px-[100px]"
          style={{ maxWidth: 1400, margin: "0 auto" }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 16,
                color: "#888",
                textAlign: "center",
                padding: "60px 0",
              }}
            >
              No properties match your guest count. Try adjusting your search.
            </p>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 13,
                  color: "#888",
                  marginBottom: 32,
                }}
              >
                {filtered.length} propert{filtered.length === 1 ? "y" : "ies"} available
                {totalGuests > 0 ? ` for ${totalGuests} guest${totalGuests !== 1 ? "s" : ""}` : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((property) => (
                  <PropertyCard key={property.slug} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function RentalsPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 80 }}>
        <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
          <RentalsContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
