"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/data/properties";
import BookingCalendar from "./BookingCalendar";
import { PROPERTY_MAP } from "@/lib/hospitable";


const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";

const TAX_RATE = 0.175; // 17.5% Barbados VAT + fees

interface BookingWidgetProps {
  property: Property;
}


function getSeasonalRate(property: Property, checkIn: string): number | null {
  if (!checkIn) return null;
  const date = new Date(checkIn);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 12 && day >= 20) || (month === 1 && day <= 10)) {
    const xmas = property.pricing.find((p) => p.season === "christmas");
    if (xmas) return xmas.pricePerNight;
  }
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
  const summer = property.pricing.find((p) => p.season === "summer");
  return summer ? summer.pricePerNight : property.pricing[0]?.pricePerNight ?? null;
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const minPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Fetch availability + pricing for selected range
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [apiTotal, setApiTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setIsAvailable(null);
      setApiTotal(null);
      return;
    }

    const controller = new AbortController();
    setAvailabilityLoading(true);

    const qs = `?propertySlug=${property.slug}&checkIn=${checkIn}&checkOut=${checkOut}`;

    Promise.all([
      fetch(`${SUPABASE_URL}/functions/v1/availability${qs}`, { signal: controller.signal }).then((r) => r.json()),
      fetch(`${SUPABASE_URL}/functions/v1/pricing${qs}`, { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([avail, pricing]) => {
        setIsAvailable(avail?.available ?? true);
        if (pricing && !pricing.notConfigured && pricing.totalPrice) {
          setApiTotal(pricing.totalPrice);
        } else {
          setApiTotal(null);
        }
      })
      .catch(() => {
        // abort or network error
      })
      .finally(() => setAvailabilityLoading(false));

    return () => controller.abort();
  }, [checkIn, checkOut, nights, property.slug]);

  const seasonalRate = getSeasonalRate(property, checkIn);
  const displayNightlyRate = seasonalRate ?? minPrice;

  // Use API total if available, otherwise fall back to seasonal rate × nights
  const baseTotal = apiTotal ?? (seasonalRate ? seasonalRate * nights : null);
  const totalWithTax = baseTotal ? baseTotal * (1 + TAX_RATE) : null;

  const hasPropertyId = Boolean(PROPERTY_MAP[property.slug]);

  const bookingUrl = (() => {
    if (checkIn && checkOut) {
      const p = new URLSearchParams({
        slug:   property.slug,
        checkIn,
        checkOut,
        guests: String(guests),
      });
      return `/booking-reservation?${p.toString()}`;
    }
    return "#";
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
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: 13,
    color: "#363636",
    outline: "none",
    background: "#FFFFFF",
    boxSizing: "border-box",
  };

  return (
    <>
      {/* Calendar — shown in the left column on the page, driven by lifted state */}
      <BookingCalendar
        propertySlug={property.slug}
        checkIn={checkIn}
        checkOut={checkOut}
        onDatesChange={(ci, co) => {
          setCheckIn(ci);
          setCheckOut(co);
        }}
      />

      {/* Booking summary widget */}
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
            fontFamily: "var(--font-roboto-slab), serif",
            fontSize: 13,
            color: "#888",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {checkIn && checkOut ? "Prices start at:" : "Starting from"}
        </p>
        <p
          style={{
            fontFamily: "var(--font-roboto-slab), serif",
            fontSize: 32,
            fontWeight: 400,
            color: "#363636",
            marginBottom: 4,
          }}
        >
          ${displayNightlyRate.toLocaleString()}
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
        {!(checkIn && checkOut) && (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              color: "#aaa",
              marginBottom: 20,
            }}
          >
            Enter dates for seasonal pricing
          </p>
        )}

        {/* Total with tax */}
        {totalWithTax && nights > 0 && (
          <p
            style={{
              fontFamily: "var(--font-roboto-slab), serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#363636",
              marginBottom: 4,
            }}
          >
            ${totalWithTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#888",
              }}
            >
              {" "}for {nights} night{nights !== 1 ? "s" : ""}
            </span>
          </p>
        )}
        {totalWithTax && nights > 0 && (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 11,
              color: "#aaa",
              marginBottom: 20,
            }}
          >
            (includes taxes and fees)
          </p>
        )}

        {/* Fields */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Check-in Date</label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
            }}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Check-out Date</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckOut(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Adults</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Availability status */}
        {availabilityLoading && (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              color: "#888",
              marginBottom: 12,
            }}
          >
            Checking availability…
          </p>
        )}
        {!availabilityLoading && isAvailable !== null && (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              color: isAvailable ? "#042E28" : "#c0392b",
              marginBottom: 12,
            }}
          >
            {isAvailable
              ? `${property.name} is available for selected dates.`
              : "These dates are not available. Please choose different dates."}
          </p>
        )}

        {/* CTA */}
        <a
          href={isAvailable === false ? undefined : (checkIn && checkOut ? bookingUrl : undefined)}
          onClick={(!checkIn || !checkOut) ? (e) => { e.preventDefault(); alert("Please select check-in and check-out dates on the calendar."); } : undefined}
          style={{
            display: "block",
            background: isAvailable === false ? "#aaa" : (!checkIn || !checkOut) ? "#888" : "#1a1a1a",
            color: "#FFFFFF",
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 13,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "4.2px",
            textAlign: "center",
            padding: "16px 20px",
            textDecoration: "none",
            transition: "opacity 0.2s",
            cursor: isAvailable === false ? "not-allowed" : "pointer",
            pointerEvents: isAvailable === false ? "none" : "auto",
          }}
        >
          {!hasPropertyId ? "Contact to Book" : (!checkIn || !checkOut) ? "Select Dates to Book" : "Book Now"}
        </a>

        {!hasPropertyId && (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 11,
              color: "#aaa",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            This property is not yet bookable online. Please{" "}
            <a href="/contact" style={{ color: "#042E28" }}>
              contact us
            </a>{" "}
            to enquire.
          </p>
        )}
      </div>
    </>
  );
}
