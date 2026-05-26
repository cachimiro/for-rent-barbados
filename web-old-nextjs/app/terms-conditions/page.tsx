import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions – For Rent Barbados",
  description:
    "Terms and Conditions for For Rent Barbados | Inspired Real Estate Ltd. Effective March 1, 2025.",
};

const sections = [
  {
    title: "1. Booking & Payment Policy",
    content: [
      "A 50% non-refundable deposit is required within 7 working days to confirm a reservation.",
      "The remaining 50% balance is due 60 days prior to arrival for standard bookings, or 90 days prior for Christmas and New Year bookings.",
      "Full payment is required if booking is made within 60 days of arrival.",
      "Bookings are not confirmed until the deposit has reached our account.",
    ],
  },
  {
    title: "2. Cancellation & Refund Policy",
    content: [
      "Standard Bookings: Cancellations more than 60 days before arrival — refunds exclude the 50% non-refundable deposit. Less than 60 days — no refund will be issued.",
      "Holiday Season (Christmas & New Year): All payments are non-refundable.",
      "Refunds will be made less any foreign exchange losses or bank charges.",
    ],
  },
  {
    title: "3. Security & Damage Protection",
    content: [
      "All properties carry a security hold of US$750 which will be held on the guest's card.",
      "For damages exceeding this amount, guests will be liable for additional costs.",
      "Guests are responsible for replacing lost keys, repairing property damage beyond normal wear, and cleaning charges due to negligence.",
    ],
  },
  {
    title: "4. Client Responsibilities",
    content: [
      "Not exceed 2 guests per bedroom.",
      "Not host events, parties, or weddings.",
      "Maintain cleanliness of the property.",
      "Abide by a strict no-smoking policy indoors.",
      "Adhere to Check-In: 3:00 PM and Check-Out: 11:00 AM unless otherwise arranged.",
      "Any damage or disturbance caused may result in immediate termination of the rental without refund.",
    ],
  },
  {
    title: "5. Liability & Disclaimers",
    content: [
      "Clients use the property and services at their own risk.",
      "The company is not liable for injuries or accidents, loss, theft, or damage of personal belongings, or service outages (WiFi, electricity, plumbing) beyond our control.",
      "Clients assume full responsibility for the health and safety of all guests, including children.",
    ],
  },
  {
    title: "6. Property Access & Owner Responsibilities",
    content: [
      "Property owners will not enter the premises without client permission, except for emergencies or necessary repairs.",
      "Clients will be provided with full access to paid-for rooms and basic amenities such as linen and cutlery.",
      "Locked 'owner-only' storage areas may be on site.",
    ],
  },
  {
    title: "7. Double Bookings",
    content: [
      "In rare cases of double bookings, we will offer an alternate property of similar value.",
      "If not accepted, a full refund of all payments will be issued.",
      "We will be released of any further obligations.",
    ],
  },
  {
    title: "8. Indemnity",
    content: [
      "By using this site and our services, you agree to hold harmless Inspired Real Estate Ltd. | Barnard Realty Inc. from any legal or financial claims related to property use, third-party service providers, contract breaches, or liability claims including injury, theft, or property damage.",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These Terms and Conditions shall be governed in accordance with the laws of Barbados.",
    ],
  },
];

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p
              style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              For Rent Barbados | Inspired Real Estate Ltd.
            </p>
          </div>
        </div>

        <main style={{ background: "#FFFFFF", padding: "80px 0" }}>
          <div
            className="px-5 md:px-10 lg:px-[100px]"
            style={{ maxWidth: 860, margin: "0 auto" }}
          >
            {/* Effective date */}
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "#888",
                marginBottom: 48,
                paddingBottom: 24,
                borderBottom: "1px solid #EAEAEA",
              }}
            >
              <strong>Effective Date:</strong> March 1, 2025 &nbsp;·&nbsp;{" "}
              <strong>Company:</strong> For Rent Barbados | Inspired Real Estate Ltd.
            </p>

            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 15,
                lineHeight: "1.9",
                color: "#363636",
                marginBottom: 48,
              }}
            >
              Welcome to our website. These Terms and Conditions govern your use of our
              website and rental services. By accessing or using this site, you agree to
              be bound by the following terms.
            </p>

            {/* Sections */}
            {sections.map((section) => (
              <div
                key={section.title}
                style={{
                  marginBottom: 40,
                  paddingBottom: 40,
                  borderBottom: "1px solid #EAEAEA",
                }}
              >
                <h2
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#363636",
                    marginBottom: 16,
                  }}
                >
                  {section.title}
                </h2>
                <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: 14,
                        lineHeight: "1.9",
                        color: "#555",
                        paddingLeft: 20,
                        position: "relative",
                        marginBottom: 8,
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
                        –
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div style={{ paddingTop: 8 }}>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 14,
                  color: "#555",
                  lineHeight: "1.9",
                }}
              >
                For questions, please contact us at:{" "}
                <a
                  href="mailto:holiday@forrentbarbados.com"
                  style={{ color: "#042E28", textDecoration: "none" }}
                >
                  holiday@forrentbarbados.com
                </a>{" "}
                |{" "}
                <a
                  href="tel:+12462472229"
                  style={{ color: "#042E28", textDecoration: "none" }}
                >
                  +1 (246) 247-2229
                </a>
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
