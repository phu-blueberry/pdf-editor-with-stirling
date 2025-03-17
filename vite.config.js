import { defineConfig } from "vite";
import path from "path";

const defineAlias = ({ mode }) => {
  const defines = {
    CHROME: mode === "chrome",
    GENERIC: mode === "generic",
    MOZCENTRAL: mode === "mozcentral",
    GECKOVIEW: mode === "geckoview"
  };

  const libraryAlias = {
    "display-cmap_reader_factory": "src/display/stubs.js",
    "display-standard_fontdata_factory": "src/display/stubs.js",
    "display-wasm_factory": "src/display/stubs.js",
    "display-fetch_stream": "src/display/stubs.js",
    "display-network": "src/display/stubs.js",
    "display-node_stream": "src/display/stubs.js",
    "display-node_utils": "src/display/stubs.js"
  };

  const viewerAlias = {
    "web-alt_text_manager": "src/web/alt_text_manager.js",
    "web-annotation_editor_params": "src/web/annotation_editor_params.js",
    "web-download_manager": "",
    "web-external_services": "",
    "web-new_alt_text_manager": "src/web/new_alt_text_manager.js",
    "web-null_l10n": "",
    "web-pdf_attachment_viewer": "src/web/pdf_attachment_viewer.js",
    "web-pdf_cursor_tools": "src/web/pdf_cursor_tools.js",
    "web-pdf_document_properties": "src/web/pdf_document_properties.js",
    "web-pdf_find_bar": "src/web/pdf_find_bar.js",
    "web-pdf_layer_viewer": "src/web/pdf_layer_viewer.js",
    "web-pdf_outline_viewer": "src/web/pdf_outline_viewer.js",
    "web-pdf_presentation_mode": "src/web/pdf_presentation_mode.js",
    "web-pdf_sidebar": "src/web/pdf_sidebar.js",
    "web-pdf_thumbnail_viewer": "src/web/pdf_thumbnail_viewer.js",
    "web-preferences": "",
    "web-print_service": "",
    "web-secondary_toolbar": "src/web/secondary_toolbar.js",
    "web-signature_manager": "src/web/signature_manager.js",
    "web-toolbar": "src/web/toolbar.js"
  };

  if (defines.CHROME) {
    libraryAlias["display-cmap_reader_factory"] =
      "src/display/cmap_reader_factory.js";
    libraryAlias["display-standard_fontdata_factory"] =
      "src/display/standard_fontdata_factory.js";
    libraryAlias["display-wasm_factory"] = "src/display/wasm_factory.js";
    libraryAlias["display-fetch_stream"] = "src/display/fetch_stream.js";
    libraryAlias["display-network"] = "src/display/network.js";

    viewerAlias["web-download_manager"] = "src/web/download_manager.js";
    viewerAlias["web-external_services"] = "src/web/chromecom.js";
    viewerAlias["web-null_l10n"] = "src/web/l10n.js";
    viewerAlias["web-preferences"] = "src/web/chromecom.js";
    viewerAlias["web-print_service"] = "src/web/pdf_print_service.js";
  } else if (defines.GENERIC) {
    libraryAlias["display-cmap_reader_factory"] =
      "src/display/cmap_reader_factory.js";
    libraryAlias["display-standard_fontdata_factory"] =
      "src/display/standard_fontdata_factory.js";
    libraryAlias["display-wasm_factory"] = "src/display/wasm_factory.js";
    libraryAlias["display-fetch_stream"] = "src/display/fetch_stream.js";
    libraryAlias["display-network"] = "src/display/network.js";
    libraryAlias["display-node_stream"] = "src/display/node_stream.js";
    libraryAlias["display-node_utils"] = "src/display/node_utils.js";

    viewerAlias["web-download_manager"] = "src/web/download_manager.js";
    viewerAlias["web-external_services"] = "src/web/genericcom.js";
    viewerAlias["web-null_l10n"] = "src/web/genericl10n.js";
    viewerAlias["web-preferences"] = "src/web/genericcom.js";
    viewerAlias["web-print_service"] = "src/web/pdf_print_service.js";
  } else if (defines.MOZCENTRAL) {
    if (defines.GECKOVIEW) {
      const gvAlias = {
        "web-toolbar": "web/toolbar-geckoview.js"
      };
      for (const key in viewerAlias) {
        viewerAlias[key] = gvAlias[key] || "web/stubs-geckoview.js";
      }
    }
    viewerAlias["web-download_manager"] = "src/web/firefoxcom.js";
    viewerAlias["web-external_services"] = "src/web/firefoxcom.js";
    viewerAlias["web-null_l10n"] = "src/web/l10n.js";
    viewerAlias["web-preferences"] = "src/web/firefoxcom.js";
    viewerAlias["web-print_service"] = "src/web/firefox_print_service.js";
  }

  return {
    resolve: {
      alias: {
        ...Object.fromEntries(
          Object.entries({
            ...libraryAlias,
            ...viewerAlias
          }).map(([key, value]) => [
            key,
            value ? path.resolve(__dirname, value) : ""
          ])
        )
      }
    }
  };
};

export default defineConfig(() => {
  const basicAlias = defineAlias({ mode: "chrome" }).resolve.alias;
  return {
    root: "src",
    resolve: {
      alias: {
        ...basicAlias,
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
        )
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "pdf.worker": ["pdfjs-dist/build/pdf.worker"]
          }
        }
      }
    }
  };
});
