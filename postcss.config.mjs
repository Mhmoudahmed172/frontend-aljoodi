import { fileURLToPath } from "node:url";

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Fallbacks for old iOS Safari (iPhone 6 / iOS 12); see postcss-legacy-safari.cjs.
    [fileURLToPath(new URL("./postcss-legacy-safari.cjs", import.meta.url))]: {},
    "@csstools/postcss-is-pseudo-class": { preserve: false, onComplexSelector: "warning" },
    "@csstools/postcss-cascade-layers": {},
  },
};

export default config;
