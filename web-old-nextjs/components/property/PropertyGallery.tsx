"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const preview = images.slice(0, 5);
  const remaining = images.length - preview.length;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: images.length === 1 ? "1fr" : "2fr 1fr",
          gridTemplateRows: "auto",
          gap: 4,
          maxHeight: 520,
          overflow: "hidden",
        }}
      >
        {/* Main image */}
        <div
          style={{ position: "relative", cursor: "pointer", gridRow: "1 / 3" }}
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={`${propertyName} — photo 1`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>

        {/* Secondary images */}
        {preview.slice(1).map((src, i) => (
          <div
            key={src}
            style={{ position: "relative", cursor: "pointer", minHeight: 120 }}
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={src}
              alt={`${propertyName} — photo ${i + 2}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            {/* "View all" overlay on last visible thumbnail */}
            {i === preview.slice(1).length - 1 && remaining > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#FFFFFF",
                  }}
                >
                  +{remaining} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View all button */}
      {images.length > 1 && (
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            onClick={() => openLightbox(0)}
            style={{
              background: "none",
              border: "1px solid #363636",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#363636",
              padding: "8px 20px",
              cursor: "pointer",
            }}
          >
            View all {images.length} photos
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "none",
              border: "none",
              color: "#FFFFFF",
              fontSize: 32,
              cursor: "pointer",
              lineHeight: 1,
              zIndex: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Counter */}
          <span
            style={{
              position: "absolute",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "1px",
            }}
          >
            {lightboxIndex + 1} / {images.length}
          </span>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{
                position: "absolute",
                left: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#FFFFFF",
                fontSize: 28,
                width: 48,
                height: 48,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            style={{ position: "relative", width: "90vw", maxWidth: 1100, height: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${propertyName} — photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{
                position: "absolute",
                right: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#FFFFFF",
                fontSize: 28,
                width: 48,
                height: 48,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
