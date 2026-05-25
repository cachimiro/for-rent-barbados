"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #EAEAEA",
  padding: "12px 16px",
  fontFamily: "var(--font-spinnaker), sans-serif",
  fontSize: 14,
  color: "#363636",
  outline: "none",
  background: "#FFFFFF",
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#888",
  marginBottom: 6,
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <div style={{ paddingTop: 80 }}>
        {/* Page heading */}
        <div style={{ background: "#042E28", padding: "60px 0" }}>
          <div
            className="px-5 md:px-10 lg:px-[100px]"
            style={{ maxWidth: 1400, margin: "0 auto" }}
          >
            <h1
              style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Get in Touch
            </h1>
            <p
              style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              We&apos;re here to help make your Barbados stay unforgettable.
            </p>
          </div>
        </div>

        {/* Content */}
        <main style={{ padding: "80px 0" }}>
          <div
            className="px-5 md:px-10 lg:px-[100px]"
            style={{ maxWidth: 1400, margin: "0 auto" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact form */}
              <div>
                <h2
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 28,
                    fontWeight: 500,
                    color: "#363636",
                    marginBottom: 32,
                  }}
                >
                  Send a Message
                </h2>

                {submitted ? (
                  <div
                    style={{
                      background: "#f4f6f2",
                      border: "1px solid #042E28",
                      padding: "24px 28px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: '"Times New Roman", serif',
                        fontSize: 20,
                        color: "#042E28",
                        marginBottom: 8,
                      }}
                    >
                      Thank you!
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: 14,
                        color: "#555",
                      }}
                    >
                      We&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="_gotcha"
                      style={{ display: "none" }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />

                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Subject</label>
                      <input
                        type="text"
                        placeholder="How can we help?"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Tell us about your trip..."
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          fontFamily: "var(--font-spinnaker), sans-serif",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: "#042E28",
                        border: "none",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-poppins), sans-serif",
                        fontSize: 13,
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "4.2px",
                        padding: "14px 40px",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Business info */}
              <div>
                <h2
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 28,
                    fontWeight: 500,
                    color: "#363636",
                    marginBottom: 32,
                  }}
                >
                  Contact Information
                </h2>

                <div style={{ marginBottom: 32 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#888",
                      marginBottom: 12,
                    }}
                  >
                    Business Hours (AST / UTC−4)
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 15,
                      color: "#363636",
                      lineHeight: "1.8",
                    }}
                  >
                    Monday to Saturday: 9:00 AM – 5:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#888",
                      marginBottom: 8,
                    }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:holiday@forrentbarbados.com"
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 15,
                      color: "#042E28",
                      textDecoration: "none",
                    }}
                  >
                    holiday@forrentbarbados.com
                  </a>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#888",
                      marginBottom: 8,
                    }}
                  >
                    Phone
                  </p>
                  <a
                    href="tel:+12462472229"
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 15,
                      color: "#042E28",
                      textDecoration: "none",
                    }}
                  >
                    +1 (246) 247-2229
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
