import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bio-red-100": "#FFABAB",
        "bio-red-200": "#FF9494",
        "bio-red-300": "#FF6B6B",
        "bio-red-400": "#FD4444",
        "bio-red-500": "#FF2222",
        "bio-red-600": "#BC4B4B",
        "bio-green-100": "#DCFFE1",
        "bio-green-200": "#ABFFB6",
        "bio-green-300": "#7AFF8C",
        "bio-green-400": "#4EFF66",
        "bio-green-500": "#30FF4C",
        "bio-green-600": "#54955D",
        "bio-blue-100": "#BCD7FF",
        "bio-blue-200": "#96C0FD",
        "bio-blue-300": "#6FA9FF",
        "bio-blue-400": "#4D96FF",
        "bio-blue-500": "#3788FF",
        "bio-blue-600": "#4279CB",
        "bio-yellow-100": "#FFF3BD",
        "bio-yellow-200": "#FFEEA6",
        "bio-yellow-300": "#FFE26C",
        "bio-yellow-400": "#FFD93D",
        "bio-yellow-500": "#FFD528",
        "bio-yellow-600": "#FFCD00",
        "bio-orange-100": "#FFE3A8",
        "bio-orange-200": "#FFD47D",
        "bio-orange-300": "#FFCA5F",
        "bio-orange-400": "#FFC041",
        "bio-orange-500": "#FFAB00",
        "bio-orange-600": "#EB9C00",
        "bio-cyan-100": "#AFFFFF",
        "bio-cyan-200": "#8DFFFF",
        "bio-cyan-300": "#40FFFF",
        "bio-cyan-400": "#00FFFF",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
        poppins: ["Poppins"],
      },
      minHeight: {
        "24": "6rem",
      },
    },
  },
} satisfies Config;
