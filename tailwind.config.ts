import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        c1: "#232365",
        c2: "#c9c9c9",
        c3: "#181855",
        c4: "#797979",

        bg1: "#0C0C0C",
        t1: "#D9D567",
        t2: "#67EDFF",
        t3: "#A1FF67",

        w1: "#e9e9e9",
        w2: "#c9c9c9",
        w3: "#a9a9a9",
        w4: "#999999",
        w5: "#797979",

        bk1: "#202020",
        bk2: "#303030",

        b1: "#333262",
        b2: "#414AA2",
        b3: "#10164C",
        b4: "#5E66B3",
        b5: "#232966",
        b6: "#D4C9FF",
        b10: "#A29FDD",

        r1: "#B71A1A",
        r2: "#EC2727",
        r4: "#7B0B0B",

        y1: "#D0E019",
      },
    },
  },
  plugins: [],
} satisfies Config;
