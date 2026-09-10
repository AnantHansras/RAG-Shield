/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#131211",
        surface: "#1b1a18",
        "surface-raised": "#221f1c",
        "surface-sunken": "#0f0e0d",
        ink: "#ece9e2",
        "ink-soft": "#a6a299",
        "ink-faint": "#726e65",
        border: "#2c2a26",
        "border-strong": "#3c3934",
        accent: "#6d9bc7",
        "accent-ink": "#9cbedd",
        danger: "#d97a63",
        success: "#7fb894",
        disabled: "#6b6862",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};
