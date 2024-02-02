/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      "sf-pro": ["SF Pro"],
      "sf-pro-rounded": ["SF Pro Rounded"],
      notoThai: ["NotoSansThai"],
    },
  },
  plugins: [],
};
