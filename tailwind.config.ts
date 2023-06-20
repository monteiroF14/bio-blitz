import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        "press-start": ['"Press Start 2P"', "cursive"],
      },
      minHeight: {
        "24": "6rem",
      },
    },
  },
} satisfies Config;
