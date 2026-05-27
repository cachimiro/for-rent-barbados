import type { Metadata } from "next";
import { Suspense } from "react";
import BookingReservationClient from "./BookingReservationClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Booking Reservation – For Rent Barbados",
  description:
    "Complete your booking reservation for your selected For Rent Barbados property.",
};

export default function BookingReservationPage() {
  return (
    <>
      <Header />

      {/* Hero banner — matches original style */}
      <div
        style={{
          position: "relative",
          height: 260,
          background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/assets/properties/Westmoreland-Hills-35-1.jpg') center/cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
        }}
      >
        <h1
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            letterSpacing: "1px",
            textAlign: "center",
            margin: 0,
          }}
        >
          Booking Reservation
        </h1>
      </div>

      {/* Page body */}
      <Suspense fallback={<div style={{ padding: 60, textAlign: "center" }}>Loading…</div>}>
        <BookingReservationClient />
      </Suspense>

      <Footer />
    </>
  );
}
