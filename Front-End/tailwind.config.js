/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Iowan Old Style", "Palatino Linotype", "serif"],
        sans: ["Figtree", "Segoe UI", "system-ui", "sans-serif"],
      },
      colors: {
        // Todos apontam pra variáveis CSS (definidas em styles/global.css),
        // então o dark mode funciona sem precisar de dark: em cada classe.
        paper: { DEFAULT: "var(--color-paper)", 2: "var(--color-paper-2)" },
        ink: { DEFAULT: "var(--color-ink)", soft: "var(--color-ink-soft)" },
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        cream: "var(--color-card)",
        pine: { DEFAULT: "var(--color-pine)", 2: "var(--color-pine-2)" },
        primary: { DEFAULT: "var(--color-pine)", foreground: "var(--color-primary-foreground)" },
        secondary: { DEFAULT: "var(--color-secondary)", foreground: "var(--color-ink)" },
        destructive: "var(--color-destructive)",
        warn: "var(--color-warn)",
        ok: "var(--color-ok)",
        wait: "var(--color-wait)",
        hold: "var(--color-hold)",
      },
      borderRadius: {
        card: "0.9rem",
      },
    },
  },
  plugins: [],
};
