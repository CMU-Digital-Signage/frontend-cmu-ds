/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    textColor: {
      white: "#FFF",
      black: "#000",
    },
    extend: {},
    fontFamily: {
      "sf-pro": ["SF Pro"],
      "sf-pro-rounded": ["SF Pro Rounded"],
      "notoThai" : ["NotoSansThai"]
    },
    colors: {
      red: "#FF0000",
      rose: "#ED3838",
      periwinkle: "#696CA3",
      royalBule: "#3671BF",
      babyBule: "#C2DDFD",
      turquoise: "#4DF8D7",
      teal: "#36BFA7",
      charcoal: "#4A484C",
      darkGray: "#2D2E2F",
    },
  },
};
