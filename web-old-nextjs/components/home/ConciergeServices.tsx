const services = [
  {
    title: "VIP Airport Arrival & Transfers",
    description: "Enjoy a smooth welcome with fast-track airport service and private transport straight to your villa.",
  },
  {
    title: "Personal Driver Services",
    description: "Move around Barbados in comfort and style with your own dedicated driver, on your schedule.",
  },
  {
    title: "Private Chef at Your Villa",
    description: "Savor gourmet meals prepared fresh in your villa — tailored to your taste, without lifting a finger.",
  },
  {
    title: "Guided Fishing Excursions",
    description: "Head out on the water with expert guides for a memorable day of deep-sea or coastal fishing.",
  },
  {
    title: "Unseen Barbados Boat Tours",
    description: "Discover hidden coves, quiet beaches, and breathtaking coastal views on a private boat tour.",
  },
  {
    title: "Curated Picnics",
    description: "Relax seaside with a beautifully set picnic — locally inspired, thoughtfully prepared, and entirely effortless.",
  },
];

// Alternating card backgrounds matching original columns
const cardBgs = ["#FAFAFA", "#F3F3F3", "#FAFAFA", "#F3F3F3", "#FAFAFA", "#F3F3F3"];

export default function ConciergeServices() {
  return (
    <section id="services" style={{ background: "#FFFFFF", padding: "80px 0 0 0" }}>
      <div className="px-5 md:px-10 lg:px-[100px]" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: 50 }}>
          <h2
            style={{
              fontFamily: "var(--font-roboto-slab), serif",
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              fontWeight: 500,
              textTransform: "capitalize",
              lineHeight: "32px",
              color: "#363636",
              marginBottom: 12,
            }}
          >
            Island Experiences &amp; Concierge Services
          </h2>
          <p
            style={{
              fontFamily: "var(--font-roboto-slab), serif",
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#363636",
            }}
          >
            We handle the details — you enjoy the island.
          </p>
        </div>

        {/* 3×2 grid — heading + text only, alternating bg, 1px border */}
        <div
          style={{ marginTop: 50 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              style={{
                background: cardBgs[i],
                border: "1px solid #9F9F9F",
                padding: "50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-roboto-slab), serif",
                  fontSize: 20,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  lineHeight: "32px",
                  color: "#363636",
                  marginBottom: 12,
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12,
                  lineHeight: "18px",
                  color: "#888888",
                  textAlign: "center",
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
