const reasons = [
  {
    iconClass: "travelpack travelpack-airplane",
    title: "Handpicked Island Stays",
    description: "Every villa, condo, and townhouse is carefully selected for quality, comfort, and location.",
  },
  {
    iconClass: "travelpack travelpack-camera",
    title: "Personalized Concierge Services",
    description: "From private chefs to boat tours, we tailor your stay to match your travel style.",
  },
  {
    iconClass: "travelpack travelpack-compass",
    title: "Local Expertise, Seamless Support",
    description: "Barbados is our home — count on us for insider tips, responsive help, and effortless bookings.",
  },
];

export default function WhyBookWithUs() {
  return (
    <section style={{ background: "#000000", padding: "80px 0" }}>
      <div className="px-5 md:px-10 lg:px-[100px]" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              fontWeight: 500,
              textTransform: "capitalize",
              lineHeight: "32px",
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            Why Book with Us?
          </h2>
          <p
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#FFFFFF",
            }}
          >
            Your Barbados escape, handled with care.
          </p>
        </div>

        {/* 3-column icon boxes */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              style={{
                padding: "0 40px 0 0",
                paddingLeft: i === 0 ? 0 : 40,
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.3)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {/* White circle with travelpack icon */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  flexShrink: 0,
                }}
              >
                <i
                  className={reason.iconClass}
                  style={{ fontSize: 33, color: "#000000", lineHeight: 1 }}
                  aria-hidden="true"
                />
              </div>

              <h3
                style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#FFFFFF",
                  marginBottom: 12,
                  lineHeight: "1.4",
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 16,
                  lineHeight: "26px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
