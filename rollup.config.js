import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
// import visualizer from "rollup-plugin-visualizer";
import packageJson from "./package.json";

/**
 * TODO(s)
 *  ~ should we inject the css into each output file or we can create a single file and then inject the import, possible?
 *  ~ what output files should have a minified version
 *  ~ export the dts file
 *  ~ add del() to remove the old build
 */

/**
 * Entry point of our library
 * @type {string}
 */
const input = "./src/index.ts";

/**
 * Get the minified version name of a `.js` file
 * @param pathToFile
 * @return string
 */
const getMinifiedName = (pathToFile) => pathToFile.replace(/\.js$/, ".min.js");

/**
 * Get the extension for the TS definition files
 * @param pathToFile
 * @return string
 */
const dtsExtension = (pathToFile) => pathToFile.replace(".js", ".d.ts");

/**
 * Definition of the common plugins used in the rollup configurations
 */
const reusablePluginList = [
  /**
   * Avoids bundling the peerDependencies (`react` and `react-dom` in our case)
   * in the final bundle as these will be provided by consumers.
   */
  peerDepsExternal(),
  /**
   * Integrates with `postcss` for bundling styles
   * TODO: bundle just one version of `.css` and `.min.css` avoid duplicates for each output type
   */
  postcss({
    plugins: [autoprefixer], // add vendor prefixes to CSS rules to avoid conflicts
    use: ["less"],
    extract: packageJson.style,
    minimize: true,
    // modules: true, // TODO: should we use it?
  }),
  /**
   * Includes the third-party external dependencies into the final bundle
   */
  nodeResolve(),
  /**
   * Converts CommonJS modules (potentially used in `node_modules`) to ES6
   * (which is what Rollup understands) so they can be included in a Rollup bundle
   */
  commonjs(),
  /**
   * Transpiles TypeScript code to JavaScript for our final bundle and generates the type declarations
   * TODO: add `d.ts` file
   */
  typescript(),
  // TODO: do we need it?
  // visualizer(),
];

/**
 * Packages that should not be in the bundle, instead they will be required
 * These packages are in the `dependencies` therefor, `require(package)` will work
 *
 * ! IMPORTANT: check if that is the case for UMD versions
 */
const externalPackages = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

/**
 * Definition of the rollup configurations
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  /**
   * CommonJS
   * This module format is most commonly used with Node using the require function.
   * Even though this is a React module (which will be consumed by an application
   * generally written in ESM format, then bundled and compiled by tools like webpack),
   * we need to consider that it might also be used within a Server side rendering environment,
   * which generally uses Node and hence might require a CJS counterpart of the library
   * (ESM modules are supported in Node environment as of v10).
   */
  {
    input,
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        exports: "named", // TODO: add description
        sourcemap: true,
      },
      // {
      //   file: getMinifiedName(packageJson.main),
      //   format: "cjs",
      //   exports: "named", // TODO: add description
      //   plugins: [
      //     // TODO: remove comments from minified
      //     terser(),
      //   ],
      // },
    ],
    plugins: reusablePluginList,
    external: externalPackages,
  },
  /**
   * ES
   * This is the modern module format that we normally use in our React applications
   * in which modules are defined using a variety of import and export statements.
   * The main benefit of shipping ES modules is that it makes your library tree-shakable.
   * This is supported by tools like Rollup and webpack 2+.
   */
  {
    input,
    output: [
      {
        file: packageJson.module,
        format: "esm",
        exports: "named", // TODO: add description
        sourcemap: true,
      },
      // We are not minifying the es modules
      // {
      //   file: getMinifiedName(packageJson.module),
      //   format: "esm",
      //   exports: "named", // TODO: add description
      //   plugins: [
      //     // TODO: remove comments from minified
      //     terser(),
      //   ],
      // },
    ],
    plugins: reusablePluginList,
    external: externalPackages,
  },
  /**
   * UMD
   * Required when the consumer requires the library using a `<script/>` tag
   */
  {
    input,
    output: [
      {
        file: getMinifiedName(packageJson.browser),
        format: "umd",
        exports: "named",
        name: "LottieReact",
        globals: {
          react: "React",
          // "lottie-web": "Lottie", // TODO: should we add `lottie-web`
        },
      },
    ],
    plugins: [...reusablePluginList, terser()],
    external: externalPackages,
  },
  /**
   * `.d.ts`
   * Generates a file with the type definitions
   */
  {
    input,
    output: {
      file: packageJson.types,
      format: "esm",
    },
    plugins: [dts()],
  },
];

export default options;
