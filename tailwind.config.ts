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
        cream: "#faf9f7",
        linen: "#f2f0ea",
        latte: "#d9d0c5",
        cafe: "#8f7c6b",
        mocha: "#403730",
        espresso: "#121212",
        gold: "#c5a47e",
        blush: "#f0e6e1"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(197,164,126,0.15), transparent 70%)",
        "hero-sheen": "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 65%)",
        "soft-wash": "linear-gradient(180deg, #faf9f7 0%, #f2f0ea 100%)",
        "editorial-wash": "linear-gradient(180deg, rgba(250,249,247,0.8) 0%, rgba(242,240,234,0.8) 100%)",
        "footer-glow": "radial-gradient(circle at center bottom, rgba(197,164,126,0.1), transparent 60%)"
      },
      boxShadow: {
        "soft": "0 10px 40px -10px rgba(18, 18, 18, 0.08)",
        "card": "0 15px 35px -5px rgba(18, 18, 18, 0.05)",
        "lift": "0 25px 50px -12px rgba(18, 18, 18, 0.15)",
        "inner": "inset 0 1px 0 rgba(255, 255, 255, 0.5)"
      }
    }
  },
  plugins: []
};

export default config;
