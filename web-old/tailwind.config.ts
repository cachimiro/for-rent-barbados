import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   "#042E28",
          accent:    "#191B18",
          dark:      "#191B18",
          shadow:    "#555754",
          midtone:   "#9C9F9B",
          highlight: "#EAEAEA",
          light:     "#FFFFFF",
          amber:     "#FFBC7D",
          green:     "#f4f6f2",
        },
        body: {
          text:      "#363636",
          muted:     "#888888",
          subtle:    "#9F9F9F",
          dark:      "#212121",
          warm:      "#FAFAFA",
          off:       "#F3F3F3",
          warmBg:    "#FFFDFB",
          highlight: "#EAEAEA",
        },
      },
      fontFamily: {
        spinnaker:    ["var(--font-spinnaker)", "sans-serif"],
        poppins:      ["var(--font-poppins)", "sans-serif"],
        roboto:       ["var(--font-roboto)", "sans-serif"],
        "roboto-slab":["var(--font-roboto-slab)", "serif"],
        lato:         ["var(--font-lato)", "sans-serif"],
        montserrat:   ["var(--font-montserrat)", "sans-serif"],
      },
      letterSpacing: {
        btn:   "0.2625rem",
        label: "0.1875rem",
      },
    },
  },
  plugins: [],
};
export default config;
