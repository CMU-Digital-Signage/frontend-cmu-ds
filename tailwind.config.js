/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "ipad-landscape": "1024px",
        "ipad-portrait": "768px",
      },
    },
    fontFamily: {
      "sf-pro": ["SF Pro"],
      "sf-pro-rounded": ["SF Pro Rounded"],
      notoThai: ["NotoSansThai"],
      lato: ["Lato"],
    },
  },
  plugins: [],
};
