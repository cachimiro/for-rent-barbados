"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { featuredProperties } from "@/data/properties";
import type { Property } from "@/data/properties";

function PropertyCard({ property }: { property: Property }) {
  const [hovered, setHovered] = useState(false);
  const startingPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));

  return (
    <Link
      href={`/accommodation/${property.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        position: "relative",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        textDecoration: "none",
        border: "5px solid transparent",
      }}
    >
      {/* Property image */}
      <Image
        src={property.coverImage}
        alt={property.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      />

      {/* Hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(4, 80, 137, 0.82)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: 28,
            fontWeight: 400,
            textTransform: "uppercase",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 12,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.35s ease",
            lineHeight: 1.3,
          }}
        >
          {property.name}
        </h3>

        {/* Guest stats */}
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 14,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: "200%",
            marginBottom: 16,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.35s ease 0.04s",
          }}
        >
          {property.guests} guests · {property.bedrooms} bedroom · {property.beds} bed · {property.bathrooms} bath
        </p>

        {/* Price */}
        <p
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: 28,
            fontWeight: 400,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 24,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.35s ease 0.08s",
          }}
        >
          ${startingPrice}/night
        </p>

        {/* CTA pill */}
        <span
          style={{
            display: "inline-block",
            border: "2px solid #FFFFFF",
            borderRadius: 50,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#FFFFFF",
            padding: "8px 22px",
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.35s ease 0.12s",
          }}
        >
          check availability
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedProperties() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F6F6F6 100%)",
        padding: "80px 0",
      }}
    >
      <div className="px-5 md:px-10 lg:px-[100px]" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: 50 }}>
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              fontWeight: 500,
              textTransform: "capitalize",
              lineHeight: "32px",
              color: "#363636",
              marginBottom: 12,
            }}
          >
            Where Barbados Feels Like Home
          </h2>
          <p
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#363636",
            }}
          >
            Handpicked villas and townhomes designed for island living at its finest.
          </p>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>

        {/* View all CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="/rentals"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 16,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "4.2px",
              color: "#000000",
              border: "1px solid #000000",
              padding: "12px 40px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            view all rentals
          </Link>
        </div>
      </div>
    </section>
  );
}
