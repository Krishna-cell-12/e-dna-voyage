import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // eDeepSea Custom Colors
        "ocean-depth": "hsl(var(--ocean-depth))",
        "bioluminescent-blue": "hsl(var(--bioluminescent-blue))",
        "bioluminescent-teal": "hsl(var(--bioluminescent-teal))",
        "bioluminescent-purple": "hsl(var(--bioluminescent-purple))",
        "coral-glow": "hsl(var(--coral-glow))",
        "species-glow": "hsl(var(--species-glow))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-abyss": "var(--gradient-abyss)",
        "gradient-bioluminescent": "var(--gradient-bioluminescent)",
        "gradient-species": "var(--gradient-species)",
        "gradient-data-flow": "var(--gradient-data-flow)",
      },
      boxShadow: {
        "bioluminescent": "var(--shadow-bioluminescent)",
        "species": "var(--shadow-species)",
        "depth": "var(--shadow-depth)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "33%": {
            transform: "translateY(-20px) rotate(120deg)",
          },
          "66%": {
            transform: "translateY(-10px) rotate(240deg)",
          },
        },
        "glow": {
          "0%": {
            textShadow: "0 0 5px hsl(var(--primary) / 0.5), 0 0 10px hsl(var(--primary) / 0.3)",
          },
          "100%": {
            textShadow: "0 0 10px hsl(var(--primary) / 0.8), 0 0 20px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.3)",
          },
        },
        "pulse-bioluminescent": {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
        },
        "data-flow": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "pulse-bioluminescent": "pulse-bioluminescent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-flow": "data-flow 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
