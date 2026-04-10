import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2.5rem"
      }
    },
    extend: {
      colors: {
        cream: "#f7f2ea",
        linen: "#fbf7f0",
        latte: "#e6d7c7",
        cafe: "#6b4b3e",
        mocha: "#3b2a23",
        espresso: "#1c1714",
        gold: "#c7a571",
        blush: "#f1e6dc"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(199,165,113,0.35), transparent 60%)",
        "hero-sheen": "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7), transparent 55%)",
        "soft-wash": "linear-gradient(135deg, #fbf7f0 0%, #f7f2ea 45%, #f1e6dc 100%)",
        "editorial-wash": "linear-gradient(140deg, rgba(251,247,240,0.9) 0%, rgba(241,230,220,0.9) 50%, rgba(247,242,234,0.9) 100%)",
        "footer-glow": "radial-gradient(circle at center, rgba(199,165,113,0.25), transparent 60%)"
      },
      boxShadow: {
        "soft": "0 20px 45px rgba(28, 23, 20, 0.12)",
        "card": "0 18px 35px rgba(28, 23, 20, 0.08)",
        "lift": "0 30px 60px rgba(28, 23, 20, 0.14)",
        "inner": "inset 0 1px 0 rgba(255, 255, 255, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
