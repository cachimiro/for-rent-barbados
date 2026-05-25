"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/data/properties";

interface BookingWidgetProps {
  property: Property;
}

interface PricingResult {
  totalPrice?: number;
  nightlyRate?: number;
  nights?: number;
  currency?: string;
  notConfigured?: boolean;
}

interface AvailabilityResult {
  available: boolean;
  blockedDates: string[];
}

function getStaticPrice(property: Property, checkIn: string, checkOut: string): number | null {
  if (!checkIn || !checkOut) return null;
  const date = new Date(checkIn);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Christmas: Dec 20 – Jan 10
  if ((month === 12 && day >= 20) || (month === 1 && day <= 10)) {
    const xmas = property.pricing.find((p) => p.season === "christmas");
    if (xmas) return xmas.pricePerNight;
  }
  // Winter: Dec 15–20 and Jan 10 – Apr 15
  if (
    (month === 12 && day >= 15) ||
    (month === 1 && day > 10) ||
    month === 2 ||
    month === 3 ||
    (month === 4 && day < 15)
  ) {
    const winter = property.pricing.find((p) => p.season === "winter");
    if (winter) return winter.pricePerNight;
  }
  // Summer: Apr 15 – Dec 15
  const summer = property.pricing.find((p) => p.season === "summer");
  return summer ? summer.pricePerNight : property.pricing[0]?.pricePerNight ?? null;
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const minPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);

  const staticPrice = getStaticPrice(property, checkIn, checkOut);
  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setPricing(null);
      setAvailability(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);

    const qs = `?propertySlug=${property.slug}&checkIn=${checkIn}&checkOut=${checkOut}`;

    Promise.all([
      fetch(`/api/pricing${qs}`, { signal: controller.signal }).then((r) => r.json()),
      fetch(`/api/availability${qs}`, { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([p, a]) => {
        setPricing(p as PricingResult);
        setAvailability(a as AvailabilityResult);
      })
      .catch(() => {/* aborted or network error — silently degrade */})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [checkIn, checkOut, property.slug, nights]);

  const displayNightlyRate =
    pricing && !pricing.notConfigured && pricing.nightlyRate
      ? pricing.nightlyRate
      : staticPrice;

  const displayTotal =
    pricing && !pricing.notConfigured && pricing.totalPrice
      ? pricing.totalPrice
      : staticPrice && nights > 0
      ? staticPrice * nights
      : null;

  const isAvailable = availability ? availability.available : true;

  const bookingUrl = (() => {
    const base = `/contact`;
    // When Hospitable IDs are populated, lib/hospitable getBookingUrl will be used server-side.
    // For now link to contact page.
    return base;
  })();

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-poppins), sans-serif",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#888",
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #EAEAEA",
    padding: "10px 12px",
    fontFamily: "var(--font-spinnaker), sans-serif",
    fontSize: 13,
    color: "#363636",
    outline: "none",
    background: "#FFFFFF",
  };

  return (
    <div
      style={{
        border: "1px solid #EAEAEA",
        padding: "28px 24px",
        background: "#FFFFFF",
        position: "sticky",
        top: 100,
      }}
    >
      {/* Price heading */}
      <p
        style={{
          fontFamily: '"Times New Roman", serif',
          fontSize: 13,
          color: "#888",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {checkIn && checkOut ? "Enter dates for seasonal pricing" : `Starting from`}
      </p>
      <p
        style={{
          fontFamily: '"Times New Roman", serif',
          fontSize: 32,
          fontWeight: 400,
          color: "#363636",
          marginBottom: 24,
        }}
      >
        ${displayNightlyRate ?? minPrice}
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 14,
            color: "#888",
          }}
        >
          /night
        </span>
      </p>

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} guest{n !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      {displayTotal && nights > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderTop: "1px solid #EAEAEA",
            borderBottom: "1px solid #EAEAEA",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 13,
              color: "#363636",
            }}
          >
            ${displayNightlyRate} × {nights} night{nights !== 1 ? "s" : ""}
          </span>
          <span
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 18,
              fontWeight: 600,
              color: "#363636",
            }}
          >
            ${displayTotal.toLocaleString()}
          </span>
        </div>
      )}

      {/* Availability status */}
      {loading && (
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            color: "#888",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Checking availability…
        </p>
      )}
      {!loading && availability && (
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            color: isAvailable ? "#042E28" : "#c0392b",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {isAvailable
            ? `${property.name} is available for selected dates.`
            : "These dates are not available. Please choose different dates."}
        </p>
      )}

      {/* CTA */}
      <a
        href={bookingUrl}
        style={{
          display: "block",
          background: "#042E28",
          color: "#FFFFFF",
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 13,
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "4.2px",
          textAlign: "center",
          padding: "14px 20px",
          textDecoration: "none",
          transition: "opacity 0.2s",
          opacity: !isAvailable ? 0.5 : 1,
          pointerEvents: !isAvailable ? "none" : "auto",
        }}
      >
        Reserve
      </a>

      <p
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 11,
          color: "#aaa",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        1 of 1 available accommodation
      </p>
    </div>
  );
}
