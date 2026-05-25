import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/property/PropertyGallery";
import BookingWidget from "@/components/property/BookingWidget";
import Testimonials from "@/components/home/Testimonials";
import { properties } from "@/data/properties";

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const property = properties.find((p) => p.slug === params.slug);
  if (!property) return {};
  return {
    title: `${property.name} – For Rent Barbados`,
    description: property.description.slice(0, 160),
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill={i < rating ? "#FFBC7D" : "rgba(0,0,0,0.12)"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = properties.find((p) => p.slug === params.slug);
  if (!property) notFound();

  const minPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));
  const paragraphs = property.description.split(/\n\n+/);

  const sourceLogoMap: Record<string, string> = {
    airbnb: "/assets/Airbnb-Logo-2014-scaled.png",
    google: "/assets/badges/GReviews.png",
    direct: "/assets/badges/booking.webp",
  };

  return (
    <>
      <Header />
      <div style={{ paddingTop: 80 }}>
        {/* Gallery */}
        <div
          className="px-5 md:px-10 lg:px-[100px]"
          style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 40 }}
        >
          <PropertyGallery images={property.images} propertyName={property.name} />
        </div>

        {/* Main content */}
        <div
          className="px-5 md:px-10 lg:px-[100px]"
          style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 40px 80px" }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left — main content */}
            <div style={{ gridColumn: "span 2" }}>
              {/* Title + stats */}
              <h1
                style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: "clamp(1.8rem, 3vw, 3rem)",
                  fontWeight: 500,
                  color: "#363636",
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                {property.name}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 14,
                  color: "#888",
                  marginBottom: 8,
                }}
              >
                {property.location}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 14,
                  color: "#363636",
                  marginBottom: 32,
                  paddingBottom: 32,
                  borderBottom: "1px solid #EAEAEA",
                }}
              >
                {property.guests} guests · {property.bedrooms} bedroom ·{" "}
                {property.bathrooms} bathroom
              </p>

              {/* Description */}
              <div style={{ marginBottom: 32 }}>
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 15,
                      lineHeight: "1.9",
                      color: "#363636",
                      marginBottom: 16,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Welcome pack */}
              {property.welcomePack && (
                <div
                  style={{
                    borderLeft: "4px solid #FFBC7D",
                    background: "#FFFDFB",
                    padding: "20px 24px",
                    marginBottom: 40,
                  }}
                >
                  <p
                    style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#363636",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Welcome Pack
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 14,
                      lineHeight: "1.7",
                      color: "#555",
                    }}
                  >
                    {property.welcomePack}
                  </p>
                </div>
              )}

              {/* Seasonal pricing table */}
              <div style={{ marginBottom: 48 }}>
                <h2
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#363636",
                    marginBottom: 20,
                  }}
                >
                  Seasonal Pricing
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #EAEAEA" }}>
                      {["Season", "Dates", "Price / night"].map((h) => (
                        <th
                          key={h}
                          style={{
                            fontFamily: "var(--font-poppins), sans-serif",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            color: "#888",
                            textAlign: "left",
                            padding: "8px 12px 8px 0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {property.pricing.map((p) => (
                      <tr
                        key={p.season}
                        style={{ borderBottom: "1px solid #EAEAEA" }}
                      >
                        <td
                          style={{
                            fontFamily: '"Times New Roman", serif',
                            fontSize: 16,
                            color: "#363636",
                            padding: "14px 12px 14px 0",
                          }}
                        >
                          {p.label}
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: 13,
                            color: "#888",
                            padding: "14px 12px 14px 0",
                          }}
                        >
                          {p.dateRange}
                        </td>
                        <td
                          style={{
                            fontFamily: '"Times New Roman", serif',
                            fontSize: 20,
                            fontWeight: 400,
                            color: "#363636",
                            padding: "14px 0",
                          }}
                        >
                          USD ${p.pricePerNight.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Property reviews */}
              {property.reviews.length > 0 && (
                <div>
                  <h2
                    style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#363636",
                      marginBottom: 24,
                    }}
                  >
                    Guest Reviews
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.reviews.map((review, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #EAEAEA",
                          padding: "24px",
                        }}
                      >
                        <StarRating rating={review.rating} />
                        <p
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: 14,
                            lineHeight: "1.8",
                            color: "#383737",
                            marginBottom: 16,
                          }}
                        >
                          {review.body}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: 12,
                            borderTop: "1px solid #EAEAEA",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontFamily: '"Times New Roman", serif',
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#272727",
                                marginBottom: 2,
                              }}
                            >
                              {review.author}
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--font-montserrat), sans-serif",
                                fontSize: 12,
                                color: "#888",
                              }}
                            >
                              {review.date}
                            </p>
                          </div>
                          {review.source && sourceLogoMap[review.source] && (
                            <Image
                              src={sourceLogoMap[review.source]}
                              alt={review.source}
                              width={56}
                              height={20}
                              style={{ objectFit: "contain", opacity: 0.6 }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — booking widget */}
            <div>
              <BookingWidget property={property} />
            </div>
          </div>
        </div>

        {/* Testimonials + Footer */}
        <Testimonials />
        <Footer />
      </div>
    </>
  );
}
