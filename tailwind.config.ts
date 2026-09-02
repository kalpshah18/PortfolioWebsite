import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          dark: "rgb(53, 53, 53)",
          muted: "rgb(85, 85, 85)",
          border: "rgb(163, 163, 163)",
          lightGray: "rgb(250, 250, 250)",
          underline: "rgb(181, 181, 181)",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        project: "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.12)",
        "project-hover": "0 12px 24px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
