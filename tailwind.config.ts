import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors')

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
      },
    },
  },
  plugins: [],
} satisfies Config;
