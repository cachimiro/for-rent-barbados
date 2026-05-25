import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Volunteer in Barbados – For Rent Barbados",
  description:
    "Support local causes during your stay. Volunteer with Slow Food Barbados or Ocean Acres Animal Sanctuary.",
};

const orgs = [
  {
    name: "Slow Food Barbados",
    heading: "Support Community Wellness with Slow Food Barbados",
    image: "/assets/concierge/L5.png",
    body: "Slow Food Barbados runs the Slow Soup Drive, a powerful initiative that provides nutritious meals to the island's most vulnerable groups — single parents, the elderly, people with disabilities, and low-income families.",
    note: "This program operates across multiple parishes, creating real, lasting impact every week.",
    bullets: [
      "Prepare and distribute healthy, local meals",
      "Support local farmers, chefs, and food producers",
      "Strengthen Barbados' sustainable food systems",
    ],
    cta: "Learn More & Donate",
    ctaHref: "#",
  },
  {
    name: "Ocean Acres Animal Sanctuary",
    heading: "Help Animals in Need at Ocean Acres Animal Sanctuary",
    image: "/assets/concierge/L6.png",
    body: "Ocean Acres is a safe haven for over 200 rescued dogs and cats. Their team works tirelessly to rescue, rehabilitate, and rehome animals, while also running essential programs like spay/neuter clinics and community outreach.",
    note: null,
    bullets: [
      "Volunteer with feeding, walking, or caring for animals",
      "Become a travel buddy to help rehome pets abroad",
      "Donate to support shelter operations and medical care",
    ],
    cta: "Support Animal Welfare",
    ctaHref: "#",
  },
];

export default function VolunteerPage() {
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
              Support Local Causes During Your Stay
            </h1>
            <p
              style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Volunteer in Barbados
            </p>
          </div>
        </div>

        <main style={{ background: "#FFFFFF", padding: "80px 0" }}>
          <div
            className="px-5 md:px-10 lg:px-[100px]"
            style={{ maxWidth: 1400, margin: "0 auto" }}
          >
            {/* Intro */}
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 16,
                lineHeight: "1.9",
                color: "#363636",
                maxWidth: 760,
                marginBottom: 64,
              }}
            >
              Barbados is more than just sun, sand, and sea — it&apos;s a vibrant community
              full of opportunities to make a meaningful impact. At{" "}
              <em>ForRentBarbados.com</em>, we encourage visitors to give back while
              enjoying everything the island has to offer.
            </p>

            {/* Org cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
              {orgs.map((org, idx) => (
                <div
                  key={org.name}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                  style={{ alignItems: "center" }}
                >
                  {/* Image — alternates sides */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      order: idx % 2 === 0 ? 0 : 1,
                    }}
                    className={idx % 2 !== 0 ? "lg:order-last" : ""}
                  >
                    <Image
                      src={org.image}
                      alt={org.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h2
                      style={{
                        fontFamily: '"Times New Roman", serif',
                        fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                        fontWeight: 500,
                        color: "#363636",
                        marginBottom: 20,
                        lineHeight: 1.3,
                      }}
                    >
                      {org.heading}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: 15,
                        lineHeight: "1.9",
                        color: "#555",
                        marginBottom: 20,
                      }}
                    >
                      {org.body}
                    </p>

                    <ul style={{ marginBottom: org.note ? 16 : 28, paddingLeft: 0, listStyle: "none" }}>
                      {org.bullets.map((b) => (
                        <li
                          key={b}
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: 14,
                            color: "#363636",
                            lineHeight: "1.8",
                            paddingLeft: 20,
                            position: "relative",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#042E28",
                              fontWeight: 700,
                            }}
                          >
                            ·
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    {org.note && (
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat), sans-serif",
                          fontSize: 13,
                          fontStyle: "italic",
                          color: "#888",
                          marginBottom: 28,
                          lineHeight: "1.7",
                        }}
                      >
                        {org.note}
                      </p>
                    )}

                    <a
                      href={org.ctaHref}
                      style={{
                        display: "inline-block",
                        background: "#042E28",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-poppins), sans-serif",
                        fontSize: 13,
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                        padding: "12px 32px",
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                      }}
                    >
                      {org.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
