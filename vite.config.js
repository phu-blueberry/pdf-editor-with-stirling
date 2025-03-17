import { defineConfig } from "vite";
import path from "path";

export default defineConfig(() => {
  return {
    root: "src",
    resolve: {
      alias: {
        "@": new URL("src", import.meta.url).pathname, // Now you can use '@' for imports
        "pdfjs-lib": path.resolve(__dirname, "src/pdf.js"),
        "display-cmap_reader_factory": path.resolve(
          new URL(".", import.meta.url).pathname,
          "src/display/cmap_reader_factory.js"
        ),
        "display-standard_fontdata_factory": path.resolve(
          __dirname,
          "src/display/standard_fontdata_factory.js"
        ),
        "display-wasm_factory": path.resolve(
          new URL(".", import.meta.url).pathname,
          "src/display/wasm_factory.js"
        ),
        "display-fetch_stream": path.resolve(
          new URL(".", import.meta.url).pathname,
          "src/display/fetch_stream.js"
        ),
        "display-network": path.resolve(
          new URL(".", import.meta.url).pathname,
          "src/display/network.js"
        ),
        "display-node_stream": path.resolve(
          new URL(".", import.meta.url).pathname,
          "src/display/node_stream.js"
        ),
        "display-node_utils": path.resolve(
          __dirname,
          "src/display/node_utils.js"
        ),
        "fluent-bundle": path.resolve(
          new URL(".", import.meta.url).pathname,
          "../../../node_modules/@fluent/bundle/esm/index.js"
        ),
        "fluent-dom": path.resolve(
          new URL(".", import.meta.url).pathname,
          "../../../node_modules/@fluent/dom/esm/index.js"
        ),
        "web-null_l10n": path.resolve(
          new URL("..", import.meta.url).pathname,
          "./web/genericl10n.js"
        ),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "pdf.worker": ["pdfjs-dist/build/pdf.worker"],
          },
        },
      },
    },
  };
});
