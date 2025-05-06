import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'm1_1': {'max': '1600px'}, // m1_1 = when screen <= 1000px
        'm1_2': {'max': '1300px'},  // m1_2 = when screen <= 800px
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-inter)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        'border-glow': {
          '0%': { boxShadow: '0 0 10px 0 var(--glow_profile_char)' },
          '50%': { boxShadow: '0 0 25px 12px var(--glow_profile_char)' },
          '100%': { boxShadow: '0 0 10px 0 var(--glow_profile_char)' },
        },
        'text-glow': {
          '0%': { textShadow: '   0 0 5px transparent,  0 0 3px var(--glow_profile_char_text), 0 0 10px var(--glow_profile_char_text), 0 0 15px var(--glow_profile_char_text)     , 0 0 30px var(--glow_profile_char_text)'},
          '24%': { textShadow: '  0 0 5px transparent,  0 0 3px var(--glow_profile_char_text),  0 0 95px var(--glow_profile_char_text), 0 0 30px var(--glow_profile_char_text)    , 0 0 30px var(--glow_profile_char_text)'},
          '50%': { textShadow: '  0 0 5px var(--glow_profile_char_text),  0 0 115px var(--glow_profile_char_text),  0 0 195px var(--glow_profile_char_text), 0 0 130px var(--glow_profile_char_text), 0 0 130px var(--glow_profile_char_text)'},
          '74%': { textShadow: '  0 0 5px transparent,  0 0 3px var(--glow_profile_char_text),  0 0 95px var(--glow_profile_char_text), 0 0 30px var(--glow_profile_char_text)    , 0 0 30px var(--glow_profile_char_text)'},
          '100%': { textShadow: ' 0 0 5px transparent,  0 0 3px var(--glow_profile_char_text), 0 0 10px var(--glow_profile_char_text), 0 0 15px var(--glow_profile_char_text)     , 0 0 30px var(--glow_profile_char_text)    '},
        },
        'eid_glow': {
          '0%': {   opacity: '1' },
          '30%': {  opacity: '0.9' },
          '40%': {  opacity: '0.7' },
          '50%': {  opacity: '0.7' },
          '60%': {  opacity: '0.7' },
          '70%': {  opacity: '0.9' },
          '100%': { opacity: '1' },
          // '0%': { filter: 'brightness(1.4)' },
          // '30%': { filter: 'brightness(1.2)' },
          // '40%': { filter: 'brightness(1.0)' },
          // '50%': { filter: 'brightness(0.5)' },
          // '60%': { filter: 'brightness(1.0)' },
          // '70%': { filter: 'brightness(1.2)' },
          // '100%': { filter: 'brightness(1.4)' },
        }
      },
      animation: {
        'border-glow': 'border-glow 3s forwards ease-out infinite',
        'eid_glow': 'eid_glow 9s forwards ease-out infinite',
        'text-glow': 'text-glow 1.6283652s infinite',
      },
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

        b0: "#020071",
        b1: "#333262",
        b2: "#414AA2",
        b3: "#10164C",
        b4: "#5E66B3",
        b5: "#232966",
        b6: "#D4C9FF",
        b7: "#1E1C65",
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
