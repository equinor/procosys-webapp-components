import image from "@rollup/plugin-image";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "es",
      exports: "named",
      sourcemap: true,
      strict: false,
      interop: "compat"
    }
  ],
  plugins: [typescript(), image()],
  external: ["react", "react-dom"]
};
