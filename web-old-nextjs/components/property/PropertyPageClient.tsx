"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Property } from "@/data/properties";
import BookingCalendar from "./BookingCalendar";
import BookingWidgetForm from "./BookingWidgetForm";

interface PropertyPageClientProps {
  property: Property;
  leftColumn: ReactNode;
}

export default function PropertyPageClient({
  property,
  leftColumn,
}: PropertyPageClientProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
        gap: "48px",
        alignItems: "start",
      }}
      className="grid-cols-1 lg:grid-cols-3"
    >
      {/* Left column — static content + calendar */}
      <div>
        {leftColumn}

        {/* Availability Calendar */}
        <div style={{ marginTop: 48 }}>
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 22,
              fontWeight: 500,
              color: "#363636",
              marginBottom: 20,
            }}
          >
            Availability
          </h2>
          <BookingCalendar
            propertySlug={property.slug}
            checkIn={checkIn}
            checkOut={checkOut}
            onDatesChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
            }}
          />
        </div>
      </div>

      {/* Right column — sticky booking form */}
      <div style={{ position: "sticky", top: 100 }}>
        <BookingWidgetForm
          property={property}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />
      </div>
    </div>
  );
}
