import { terser } from "rollup-plugin-terser";

export default [
    {
        input: ["src/js/Game.js"],
        plugins: [terser()],
        output: [
          {
            file: "dist/cube.js",
            format: "iife",
            sourcemap: true,
            name:"cube"
          },
        ],
        
    },


]