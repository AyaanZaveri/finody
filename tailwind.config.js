/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

// --background-light: theme(colors.white);
// --primary-50: theme(colors.emerald.50);
// --primary-100: theme(colors.emerald.100);
// --primary-200: theme(colors.emerald.200);
// --primary-300: theme(colors.emerald.300);
// --primary-400: theme(colors.emerald.400);
// --primary-500: theme(colors.emerald.500);
// --primary-600: theme(colors.emerald.600);
// --primary-700: theme(colors.emerald.700);
// --primary-800: theme(colors.emerald.800);
// --primary-900: theme(colors.emerald.900);
// --secondary-50: theme(colors.stone.50);
// --secondary-100: theme(colors.stone.100);
// --secondary-200: theme(colors.stone.200);
// --secondary-300: theme(colors.stone.300);
// --secondary-400: theme(colors.stone.400);
// --secondary-500: theme(colors.stone.500);
// --secondary-600: theme(colors.stone.600);
// --secondary-700: theme(colors.stone.700);
// --secondary-800: theme(colors.stone.800);
// --secondary-900: theme(colors.stone.900);

module.exports = {
  darkMode: false,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        "b": "var(--background)",
        "p-50": "var(--primary-50)",
        "p-100": "var(--primary-100)",
        "p-200": "var(--primary-200)",
        "p-300": "var(--primary-300)",
        "p-400": "var(--primary-400)",
        "p-500": "var(--primary-500)",
        "p-600": "var(--primary-600)",
        "p-700": "var(--primary-700)",
        "p-800": "var(--primary-800)",
        "p-900": "var(--primary-900)",
        "s-50": "var(--secondary-50)",
        "s-100": "var(--secondary-100)",
        "s-200": "var(--secondary-200)",
        "s-300": "var(--secondary-300)",
        "s-400": "var(--secondary-400)",
        "s-500": "var(--secondary-500)",
        "s-600": "var(--secondary-600)",
        "s-700": "var(--secondary-700)",
        "s-800": "var(--secondary-800)",
        "s-900": "var(--secondary-900)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-labeled-groups")(["one", "two"]),
  ],
  variants: {
    hover: "hover",
    active: "active",
  },
};
