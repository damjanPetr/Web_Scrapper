import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, addComponents, addUtilities }) {
      addComponents({});
      addUtilities({
        ".fcen": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      addVariant("group-open", [":merge(.group).open &"]);
      addVariant("peer-open", [":merge(.peer).open &"]);
    }),
  ],
};
export default config;
