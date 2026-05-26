import type { Metadata } from "next";
import { Roboto, Roboto_Slab, Poppins, Lato, Montserrat, Spinnaker } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const spinnaker = Spinnaker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-spinnaker",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For Rent Barbados – Luxury Vacation Rentals",
  description:
    "Hello from sunny Barbados! I'm Maisha Ward, a Property Manager and Rental Agent with over 10 years of experience in luxury vacation rentals on the West and South coasts.",
  icons: { icon: "/assets/logos/LOGO-FRB-fav-02.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={[
          roboto.variable,
          robotoSlab.variable,
          poppins.variable,
          lato.variable,
          montserrat.variable,
          spinnaker.variable,
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
