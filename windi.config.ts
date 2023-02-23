import { defineConfig } from "windicss/helpers";
import formsPlugin from "windicss/plugin/forms";
import plugin from "windicss/plugin";

export default defineConfig({
  darkMode: "class",
  safelist: "p-3 p-4 p-5",
  theme: {
    extend: {
      colors: {
        teal: {
          100: "#096",
        },
      },
    },
  },
  plugins: [
    formsPlugin,
    plugin(({ addUtilities }) => {
      const newUtils = {
        ".customScrollBar::-webkit-scrollbar": {
          width: "10px",
        },

        ".customScrollBar::-webkit-scrollbar-track": {
          background: "#1e1e1e",
        },

        ".customScrollBar::-webkit-scrollbar-thumb": {
          background: "#424242",
        },

        ".customScrollBar::-webkit-scrollbar-thumb:hover": {
          background: "#4f4f4f",
        },
      };
      addUtilities(newUtils);
    }),
  ],
});
