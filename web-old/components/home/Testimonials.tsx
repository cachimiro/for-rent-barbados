"use client";

import { useState } from "react";
import Image from "next/image";
import { reviews } from "@/data/properties";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 20 20" fill={i < rating ? "#FFBC7D" : "rgba(0,0,0,0.12)"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const PREVIEW_LENGTH = 200;

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > PREVIEW_LENGTH;
  const displayText = !isLong || expanded ? review.body : review.body.slice(0, PREVIEW_LENGTH) + "…";

  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: "40px 10px 10px 10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <StarRating rating={review.rating} />

      <p
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 14,
          lineHeight: "1.8",
          color: "#383737",
          flex: 1,
          marginBottom: 20,
        }}
      >
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginLeft: 4,
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#042E28",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #EAEAEA" }}>
        <div>
          <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, fontWeight: 600, color: "#272727", marginBottom: 2 }}>
            {review.author}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 12, color: "#272727" }}>
            {review.property}{review.date ? ` · ${review.date}` : ""}
          </p>
        </div>
        <Image
          src="/assets/Airbnb-Logo-2014-scaled.png"
          alt="Airbnb"
          width={64}
          height={22}
          style={{ objectFit: "contain", opacity: 0.55 }}
        />
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" style={{ background: "#FFFFFF", padding: "80px 0 20px 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 100px" }} className="px-5 md:px-10 lg:px-[100px]">
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
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
            Our Guests, Their Words
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
            Our guests&apos; words capture the beauty and comfort of Barbados living.
          </p>
        </div>

        {/* 3-column reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 40 }}>
          {reviews.slice(0, 3).map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <a
            href="https://www.airbnb.com"
            target="_blank"
            rel="noopener noreferrer"
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
            }}
          >
            view all reviews
          </a>
        </div>
      </div>
    </section>
  );
}
