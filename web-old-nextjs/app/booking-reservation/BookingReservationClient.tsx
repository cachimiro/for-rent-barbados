"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { properties } from "@/data/properties";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function nightCount(ci: string, co: string): number {
  if (!ci || !co) return 0;
  return Math.round(
    (new Date(co).getTime() - new Date(ci).getTime()) / 86400000
  );
}

function getSeasonalRate(pricing: { season: string; pricePerNight: number }[], checkIn: string): number {
  if (!checkIn || !pricing.length) return pricing[0]?.pricePerNight ?? 0;
  const date = new Date(checkIn);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 12 && day >= 20) || (month === 1 && day <= 10)) {
    return pricing.find((p) => p.season === "christmas")?.pricePerNight ?? pricing[0].pricePerNight;
  }
  if ((month === 12 && day >= 15) || (month === 1 && day > 10) || month === 2 || month === 3 || (month === 4 && day < 15)) {
    return pricing.find((p) => p.season === "winter")?.pricePerNight ?? pricing[0].pricePerNight;
  }
  return pricing.find((p) => p.season === "summer")?.pricePerNight ?? pricing[0].pricePerNight;
}

// ── Accordion item ────────────────────────────────────────────────────────────
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 30px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 20,
            lineHeight: 1,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 30px 20px",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.8,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookingReservationClient() {
  const params = useSearchParams();
  const slug     = params.get("slug") ?? "";
  const checkIn  = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const guestsParam = Number(params.get("guests") ?? 2);

  const property = properties.find((p) => p.slug === slug);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [adults,    setAdults]    = useState(guestsParam);
  const [children,  setChildren]  = useState(0);
  const [message,   setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState("");

  const nights   = nightCount(checkIn, checkOut);
  const rate     = property ? getSeasonalRate(property.pricing, checkIn) : 0;
  const baseTotal = rate * nights;
  const taxRate   = 0.175;
  const totalWithTax = Math.round(baseTotal * (1 + taxRate));
  const deposit50  = Math.round(totalWithTax * 0.5);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #DCDCDC",
    padding: "10px 14px",
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: 13,
    color: "#363636",
    outline: "none",
    background: "#FFFFFF",
    boxSizing: "border-box",
    marginTop: 6,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = {
      firstName, lastName, email, phone, adults, children, message,
      property: property?.name ?? slug,
      checkIn, checkOut, nights, totalWithTax, deposit50,
    };

    // Try Supabase edge function (same pattern as availability/pricing)
    try {
      const res = await fetch(
        "https://bkqnviewrnafvvkqkhej.supabase.co/functions/v1/booking-enquiry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        setSubmitted(true);
        setSubmitting(false);
        return;
      }
    } catch {
      // Network error or function not deployed yet — fall through to mailto
    }

    // Fallback: open a pre-filled mailto so the enquiry is never lost
    const subject = encodeURIComponent(
      `Booking Enquiry – ${property?.name ?? slug} (${checkIn} to ${checkOut})`
    );
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || "–"}\n\nProperty: ${property?.name ?? slug}\nCheck-in: ${checkIn} (from 3:00 pm)\nCheck-out: ${checkOut} (until 11:00 am)\nNights: ${nights}\nAdults: ${adults}  Children: ${children}\n\nTotal (inc. tax): $${totalWithTax?.toLocaleString()}\n50% Deposit: $${deposit50?.toLocaleString()}\n\nMessage:\n${message || "–"}`
    );
    window.location.href = `mailto:maisha@forrentbarbados.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setSubmitting(false);
  }

  // ── Missing params guard ──
  if (!slug || !checkIn || !checkOut || !property) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: "80px auto",
          padding: "40px 24px",
          textAlign: "center",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <p style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
          No booking details found. Please select a property and dates first.
        </p>
        <Link
          href="/rentals"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "14px 32px",
            textDecoration: "none",
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "3px",
          }}
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  // ── Success screen ──
  if (submitted) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: "80px auto",
          padding: "60px 24px",
          textAlign: "center",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
        <h2
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: 32,
            fontWeight: 400,
            color: "#042E28",
            marginBottom: 16,
          }}
        >
          Booking Enquiry Received!
        </h2>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 8 }}>
          Thank you, <strong>{firstName}</strong>! Your enquiry for{" "}
          <strong>{property.name}</strong> ({formatDate(checkIn)} → {formatDate(checkOut)})
          has been submitted.
        </p>
        <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, marginBottom: 40 }}>
          We will be in touch within 24 hours to confirm availability and process
          your 50% deposit to secure the booking.
        </p>
        <Link
          href="/rentals"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "14px 32px",
            textDecoration: "none",
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "3px",
          }}
        >
          Back to Rentals
        </Link>
      </div>
    );
  }

  // ── Main booking page ──
  return (
    <div style={{ background: "#FFFFFF", minHeight: "60vh" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 360px",
          gap: 0,
          alignItems: "start",
        }}
        className="booking-grid"
      >
        {/* ── LEFT — Booking details + guest form ── */}
        <div style={{ padding: "50px 60px 60px 40px" }}>
          {/* Booking Details */}
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 26,
              fontWeight: 400,
              color: "#363636",
              marginBottom: 28,
            }}
          >
            Booking Details
          </h2>

          <div style={{ marginBottom: 8, fontFamily: "var(--font-montserrat), sans-serif", fontSize: 14, color: "#363636" }}>
            Check-in:{" "}
            <strong style={{ fontFamily: '"Times New Roman", serif', fontSize: 15 }}>
              {formatDate(checkIn)}
            </strong>
            <span style={{ color: "#888" }}> , from 3:00 pm</span>
          </div>
          <div
            style={{
              marginBottom: 28,
              paddingBottom: 28,
              borderBottom: "1px solid #EAEAEA",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 14,
              color: "#363636",
            }}
          >
            Check-out:{" "}
            <strong style={{ fontFamily: '"Times New Roman", serif', fontSize: 15 }}>
              {formatDate(checkOut)}
            </strong>
            <span style={{ color: "#888" }}> , until 11:00 am</span>
          </div>

          {/* Accommodation block */}
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 22,
              fontWeight: 400,
              color: "#363636",
              marginBottom: 6,
            }}
          >
            Accommodation #1
          </h2>
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 14,
              color: "#363636",
              marginBottom: 20,
            }}
          >
            Accommodation Type:{" "}
            <strong style={{ color: "#042E28" }}>{property.name}</strong>
          </p>

          {/* Adults */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Adults <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Children */}
          <div
            style={{
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: "1px solid #EAEAEA",
            }}
          >
            <label style={labelStyle}>Children</label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Price summary */}
          {nights > 0 && (
            <div
              style={{
                background: "#F9F9F9",
                border: "1px solid #EAEAEA",
                padding: "20px 24px",
                marginBottom: 32,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#888",
                  marginBottom: 12,
                }}
              >
                Price Summary
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#555" }}>
                  ${rate.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#363636", fontWeight: 600 }}>
                  ${baseTotal.toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#555" }}>
                  Taxes &amp; fees (17.5%)
                </span>
                <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#363636", fontWeight: 600 }}>
                  ${Math.round(baseTotal * taxRate).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #EAEAEA",
                  paddingTop: 12,
                  marginTop: 4,
                }}
              >
                <span style={{ fontFamily: '"Times New Roman", serif', fontSize: 16, color: "#042E28", fontWeight: 600 }}>
                  Total
                </span>
                <span style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, color: "#042E28", fontWeight: 600 }}>
                  ${totalWithTax.toLocaleString()}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 11, color: "#888", marginTop: 8 }}>
                50% deposit due now: <strong>${deposit50.toLocaleString()}</strong>
              </p>
            </div>
          )}

          {/* Guest details form */}
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 22,
              fontWeight: 400,
              color: "#363636",
              marginBottom: 24,
            }}
          >
            Your Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
              className="form-cols"
            >
              <div>
                <label style={labelStyle}>
                  First Name <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Last Name <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Email Address <span style={{ color: "#c0392b" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                placeholder="+1 246 ..."
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Special Requests / Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 100,
                }}
                placeholder="Any special requests or notes for your stay..."
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 13,
                  color: "#c0392b",
                  marginBottom: 16,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "#888" : "#1a1a1a",
                color: "#FFFFFF",
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 13,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "4px",
                padding: "18px 24px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {submitting ? "Sending…" : "Confirm Reservation"}
            </button>

            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 11,
                color: "#888",
                textAlign: "center",
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              By submitting you agree to our{" "}
              <Link href="/terms-conditions" style={{ color: "#042E28" }}>
                Terms &amp; Conditions
              </Link>
              . A 50% non-refundable deposit secures your booking.
            </p>
          </form>
        </div>

        {/* ── RIGHT — Black sidebar with policies ── */}
        <div style={{ background: "#000000", minHeight: "100%", position: "sticky", top: 0 }}>
          {/* Payment Terms — open by default */}
          <Accordion title="− Payment Terms" defaultOpen>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: 20,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
              }}
            >
              <li>50% non-refundable deposit to confirm the booking</li>
              <li>Final 50% due 60 days before arrival</li>
              <li>Full payment required if booking within 60 days</li>
            </ul>
          </Accordion>

          <Accordion title="+ Cancellation Policy">
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: 20,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
              }}
            >
              <li>The 50% deposit is non-refundable in all cases</li>
              <li>
                Cancellations 60+ days before arrival: deposit forfeited, final
                payment refunded
              </li>
              <li>
                Cancellations within 60 days: full amount forfeited
              </li>
              <li>
                We strongly recommend travel insurance to cover unforeseen
                cancellations
              </li>
            </ul>
          </Accordion>

          <Accordion title="+ Damage &amp; Liability">
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: 20,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
              }}
            >
              <li>
                Guests are responsible for any damage caused during their stay
              </li>
              <li>
                A refundable security deposit may be required prior to arrival
              </li>
              <li>
                For Rent Barbados is not liable for loss, damage, or injury
                during your stay
              </li>
            </ul>
          </Accordion>

          <Accordion title="+ House Rules">
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: 20,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
              }}
            >
              <li>No smoking inside the property</li>
              <li>No parties or events without prior approval</li>
              <li>Pets allowed only with prior written consent</li>
              <li>Check-in from 3:00 pm · Check-out by 11:00 am</li>
            </ul>
          </Accordion>

          <Accordion title="+ Additional Info">
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: 20,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
              }}
            >
              <li>
                Housekeeping is provided once every 7 days for stays of 7+ nights
              </li>
              <li>All utilities (electricity, water, Wi-Fi) are included</li>
              <li>Towels and bed linen are provided</li>
              <li>
                Airport transfers can be arranged at an additional cost —
                contact us for a quote
              </li>
            </ul>
          </Accordion>

          <Accordion title="+ Legal Note">
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.8,
              }}
            >
              This reservation constitutes a legally binding contract between the
              guest and For Rent Barbados. By completing this form you confirm you
              have read and agree to all terms and conditions. For Rent Barbados
              reserves the right to refuse or cancel any booking at its
              discretion.
            </p>
          </Accordion>
        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 768px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
          .booking-grid > div:first-child {
            padding: 32px 20px !important;
          }
          .form-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
