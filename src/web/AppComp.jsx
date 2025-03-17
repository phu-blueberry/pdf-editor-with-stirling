import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-lib";
import { PDFDocument as PDFLibDocument } from 'pdf-lib';

// PDF.js internal modules
import "../display/cmap_reader_factory.js";
import "../display/standard_fontdata_factory.js";
import "../display/wasm_factory.js";
import "../display/fetch_stream.js";
import "../display/network.js";
import "../display/stubs.js";
import "../display/stubs.js";

// Web UI components from PDF.js
import "./alt_text_manager.js";
import "./annotation_editor_params.js";
import "./download_manager.js";
import "./genericcom.js";
import "./new_alt_text_manager.js";
import "./genericl10n.js";
import "./pdf_attachment_viewer.js";
import "./pdf_cursor_tools.js";
import "./pdf_document_properties.js";
import "./pdf_find_bar.js";
import "./pdf_layer_viewer.js";
import "./pdf_outline_viewer.js";
import "./pdf_presentation_mode.js";
import "./pdf_sidebar.js";
import "./pdf_thumbnail_viewer.js";
import "./genericcom.js";
import "./pdf_print_service.js";
import "./secondary_toolbar.js";
import "./signature_manager.js";
import "./toolbar.js";

const worker = new URL("pdfjs-lib/build/pdf.worker.mjs", import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
import "../web/viewer.css";

export const GLOBAL_PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'

async function createAndLoadPDF() {
  // Create a new PDF document
  const pdfDoc = await PDFLibDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText('Hello, world!', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Convert Uint8Array to Blob (for PDF.js to load)
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl
}

const loadPdfJs = async () => {
  const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = GLOBAL_PDFJS_WORKER_URL
  return { getDocument }
}


const AppComp = () => {
  const loadFile = async () => {
    // Loading a document.
    const {getDocument} = await loadPdfJs()
    const blobPDF = await createAndLoadPDF()
    const loadingTask = getDocument(blobPDF);
    const pdfDocument = await loadingTask.promise;
    // Request a first page
    const pdfPage = await pdfDocument.getPage(1);
    // Display page on the existing canvas with 100% scale.
    const viewport = pdfPage.getViewport({ scale: 1.0 });
    const canvas = document?.getElementById("theCanvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    const renderTask = pdfPage.render({
      canvasContext: ctx,
      viewport
    });
    await renderTask.promise;
  };

  function createPDFBlob(content) {
    const blob = new Blob([content], { type: "application/pdf" });
    return blob;
  }

  const [selectedFiles, setSelectedFiles] = useState([]);

  const onFileChange = (event) => {
    if (event.target.files.length >= 2) {
      setSelectedFiles([event.target.files[0], event.target.files[1]]);
    } else {
      alert("Please select at least two PDF files.");
    }
  };

  async function mergePDFs() {
    if (selectedFiles.length < 2) {
      alert("Please select two PDF files before merging.");
      return;
    }

    const url = "http://localhost:8080/api/v1/general/merge-pdfs";
    const formData = new FormData();

    // Append selected files to formData
    formData.append("fileInput", selectedFiles[0], selectedFiles[0].name);
    formData.append("fileInput", selectedFiles[1], selectedFiles[1].name);

    // Set headers and cookies
    const headers = new Headers({
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    });

    try {
      // Fetch API call
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
        // credentials: 'include', // Ensure cookies are included
      });

      console.log("response", response);

      if (response.ok) {
        const blob = await response.blob(); // Process the response as a Blob directly
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged_pdf.pdf"; // Provide a default filename for the download
        document.body.appendChild(a); // Append the link to the document
        a.click(); // Simulate a click on the link to download the file

        // Cleanup: remove the link and revoke the URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to merge PDFs:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    loadFile();
  }, []);

  return (
    <div id="outerContainer">
      <div id="sidebarContainer">
        <div id="toolbarSidebar" class="toolbarHorizontalGroup">
          <div id="toolbarSidebarLeft">
            <div
              id="sidebarViewButtons"
              class="toolbarHorizontalGroup toggled"
              role="radiogroup"
            >
              <button
                id="viewThumbnail"
                class="toolbarButton toggled"
                type="button"
                title="Show Thumbnails"
                tabindex="0"
                data-l10n-id="pdfjs-thumbs-button"
                role="radio"
                aria-checked="true"
                aria-controls="thumbnailView"
              >
                <span data-l10n-id="pdfjs-thumbs-button-label">Thumbnails</span>
              </button>
              <button
                id="viewOutline"
                class="toolbarButton"
                type="button"
                title="Show Document Outline (double-click to expand/collapse all items)"
                tabindex="0"
                data-l10n-id="pdfjs-document-outline-button"
                role="radio"
                aria-checked="false"
                aria-controls="outlineView"
              >
                <span data-l10n-id="pdfjs-document-outline-button-label">
                  Document Outline
                </span>
              </button>
              <button
                id="viewAttachments"
                class="toolbarButton"
                type="button"
                title="Show Attachments"
                tabindex="0"
                data-l10n-id="pdfjs-attachments-button"
                role="radio"
                aria-checked="false"
                aria-controls="attachmentsView"
              >
                <span data-l10n-id="pdfjs-attachments-button-label">
                  Attachments
                </span>
              </button>
              <button
                id="viewLayers"
                class="toolbarButton"
                type="button"
                title="Show Layers (double-click to reset all layers to the default state)"
                tabindex="0"
                data-l10n-id="pdfjs-layers-button"
                role="radio"
                aria-checked="false"
                aria-controls="layersView"
              >
                <span data-l10n-id="pdfjs-layers-button-label">Layers</span>
              </button>
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div id="outlineOptionsContainer" class="toolbarHorizontalGroup">
              <div class="verticalToolbarSeparator"></div>

              <button
                id="currentOutlineItem"
                class="toolbarButton"
                type="button"
                disabled="disabled"
                title="Find Current Outline Item"
                tabindex="0"
                data-l10n-id="pdfjs-current-outline-item-button"
              >
                <span data-l10n-id="pdfjs-current-outline-item-button-label">
                  Current Outline Item
                </span>
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView"></div>
          <div id="outlineView" class="hidden"></div>
          <div id="attachmentsView" class="hidden"></div>
          <div id="layersView" class="hidden"></div>
        </div>
        <div id="sidebarResizer"></div>
      </div>
      
      <canvas id="theCanvas"></canvas>

      <div id="mainContainer">
        <div class="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer" class="toolbarHorizontalGroup">
              <div id="toolbarViewerLeft" class="toolbarHorizontalGroup">
                <button
                  id="sidebarToggleButton"
                  class="toolbarButton"
                  type="button"
                  title="Toggle Sidebar"
                  tabindex="0"
                  data-l10n-id="pdfjs-toggle-sidebar-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  aria-controls="sidebarContainer"
                >
                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label">
                    Toggle Sidebar
                  </span>
                </button>
                <div class="toolbarButtonSpacer"></div>
                <div class="toolbarButtonWithContainer">
                  <button
                    id="viewFindButton"
                    class="toolbarButton"
                    type="button"
                    title="Find in Document"
                    tabindex="0"
                    data-l10n-id="pdfjs-findbar-button"
                    aria-expanded="false"
                    aria-controls="findbar"
                  >
                    <span data-l10n-id="pdfjs-findbar-button-label">Find</span>
                  </button>
                  <div
                    class="hidden doorHanger toolbarHorizontalGroup"
                    id="findbar"
                  >
                    <div id="findInputContainer" class="toolbarHorizontalGroup">
                      <span class="loadingInput end toolbarHorizontalGroup">
                        <input
                          id="findInput"
                          class="toolbarField"
                          title="Find"
                          placeholder="Find in document…"
                          tabindex="0"
                          data-l10n-id="pdfjs-find-input"
                          aria-invalid="false"
                        />
                      </span>
                      <div class="toolbarHorizontalGroup">
                        <button
                          id="findPreviousButton"
                          class="toolbarButton"
                          type="button"
                          title="Find the previous occurrence of the phrase"
                          tabindex="0"
                          data-l10n-id="pdfjs-find-previous-button"
                        >
                          <span data-l10n-id="pdfjs-find-previous-button-label">
                            Previous
                          </span>
                        </button>
                        <div class="splitToolbarButtonSeparator"></div>
                        <button
                          id="findNextButton"
                          class="toolbarButton"
                          type="button"
                          title="Find the next occurrence of the phrase"
                          tabindex="0"
                          data-l10n-id="pdfjs-find-next-button"
                        >
                          <span data-l10n-id="pdfjs-find-next-button-label">
                            Next
                          </span>
                        </button>
                      </div>
                    </div>

                    <div
                      id="findbarOptionsOneContainer"
                      class="toolbarHorizontalGroup"
                    >
                      <div class="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findHighlightAll"
                          tabindex="0"
                        />
                        <label
                          for="findHighlightAll"
                          data-l10n-id="pdfjs-find-highlight-checkbox"
                        >
                          Highlight All
                        </label>
                      </div>
                      <div class="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findMatchCase"
                          tabindex="0"
                        />
                        <label
                          for="findMatchCase"
                          data-l10n-id="pdfjs-find-match-case-checkbox-label"
                        >
                          Match Case
                        </label>
                      </div>
                    </div>
                    <div
                      id="findbarOptionsTwoContainer"
                      class="toolbarHorizontalGroup"
                    >
                      <div class="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findMatchDiacritics"
                          tabindex="0"
                        />
                        <label
                          for="findMatchDiacritics"
                          data-l10n-id="pdfjs-find-match-diacritics-checkbox-label"
                        >
                          Match Diacritics
                        </label>
                      </div>
                      <div class="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findEntireWord"
                          tabindex="0"
                        />
                        <label
                          for="findEntireWord"
                          data-l10n-id="pdfjs-find-entire-word-checkbox-label"
                        >
                          Whole Words
                        </label>
                      </div>
                    </div>

                    <div
                      id="findbarMessageContainer"
                      class="toolbarHorizontalGroup"
                      aria-live="polite"
                    >
                      <span id="findResultsCount" class="toolbarLabel"></span>
                      <span id="findMsg" class="toolbarLabel"></span>
                    </div>
                  </div>
                </div>
                <div class="toolbarHorizontalGroup hiddenSmallView">
                  <button
                    class="toolbarButton"
                    title="Previous Page"
                    type="button"
                    id="previous"
                    tabindex="0"
                    data-l10n-id="pdfjs-previous-button"
                  >
                    <span data-l10n-id="pdfjs-previous-button-label">
                      Previous
                    </span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button
                    class="toolbarButton"
                    type="button"
                    title="Next Page"
                    id="next"
                    tabindex="0"
                    data-l10n-id="pdfjs-next-button"
                  >
                    <span data-l10n-id="pdfjs-next-button-label">Next</span>
                  </button>
                </div>
                <div class="toolbarHorizontalGroup">
                  <span class="loadingInput start toolbarHorizontalGroup">
                    <input
                      type="number"
                      id="pageNumber"
                      class="toolbarField"
                      title="Page"
                      value="1"
                      min="1"
                      tabindex="0"
                      data-l10n-id="pdfjs-page-input"
                      autocomplete="off"
                    />
                  </span>
                  <span id="numPages" class="toolbarLabel"></span>
                </div>
              </div>
              <div id="toolbarViewerMiddle" class="toolbarHorizontalGroup">
                <div class="toolbarHorizontalGroup">
                  <button
                    id="zoomOutButton"
                    class="toolbarButton"
                    type="button"
                    title="Zoom Out"
                    tabindex="0"
                    data-l10n-id="pdfjs-zoom-out-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-out-button-label">
                      Zoom Out
                    </span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button
                    id="zoomInButton"
                    class="toolbarButton"
                    type="button"
                    title="Zoom In"
                    tabindex="0"
                    data-l10n-id="pdfjs-zoom-in-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-in-button-label">
                      Zoom In
                    </span>
                  </button>
                </div>
                <span id="scaleSelectContainer" class="dropdownToolbarButton">
                  <select
                    id="scaleSelect"
                    title="Zoom"
                    tabindex="0"
                    data-l10n-id="pdfjs-zoom-select"
                  >
                    <option
                      id="pageAutoOption"
                      title=""
                      value="auto"
                      selected="selected"
                      data-l10n-id="pdfjs-page-scale-auto"
                    >
                      Automatic Zoom
                    </option>
                    <option
                      id="pageActualOption"
                      title=""
                      value="page-actual"
                      data-l10n-id="pdfjs-page-scale-actual"
                    >
                      Actual Size
                    </option>
                    <option
                      id="pageFitOption"
                      title=""
                      value="page-fit"
                      data-l10n-id="pdfjs-page-scale-fit"
                    >
                      Page Fit
                    </option>
                    <option
                      id="pageWidthOption"
                      title=""
                      value="page-width"
                      data-l10n-id="pdfjs-page-scale-width"
                    >
                      Page Width
                    </option>
                    <option
                      id="customScaleOption"
                      title=""
                      value="custom"
                      disabled="disabled"
                      hidden="true"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 0 }'
                    >
                      0%
                    </option>
                    <option
                      title=""
                      value="0.5"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 50 }'
                    >
                      50%
                    </option>
                    <option
                      title=""
                      value="0.75"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 75 }'
                    >
                      75%
                    </option>
                    <option
                      title=""
                      value="1"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 100 }'
                    >
                      100%
                    </option>
                    <option
                      title=""
                      value="1.25"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 125 }'
                    >
                      125%
                    </option>
                    <option
                      title=""
                      value="1.5"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 150 }'
                    >
                      150%
                    </option>
                    <option
                      title=""
                      value="2"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 200 }'
                    >
                      200%
                    </option>
                    <option
                      title=""
                      value="3"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 300 }'
                    >
                      300%
                    </option>
                    <option
                      title=""
                      value="4"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{ "scale": 400 }'
                    >
                      400%
                    </option>
                  </select>
                </span>
              </div>
              <div id="toolbarViewerRight" class="toolbarHorizontalGroup">
                <div
                  id="editorModeButtons"
                  class="toolbarHorizontalGroup"
                  role="radiogroup"
                >
                  <div
                    id="editorSignature"
                    class="toolbarButtonWithContainer"
                    hidden="true"
                  >
                    <button
                      id="editorSignatureButton"
                      class="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Add signature"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorSignatureParamsToolbar"
                      tabindex="0"
                      data-l10n-id="pdfjs-editor-signature-button"
                    >
                      <span data-l10n-id="pdfjs-editor-signature-button-label">
                        Add signature
                      </span>
                    </button>
                    <div
                      class="editorParamsToolbar hidden doorHangerRight menu"
                      id="editorSignatureParamsToolbar"
                    >
                      <div id="addSignatureDoorHanger" class="menuContainer">
                        <button
                          id="editorSignatureAddSignature"
                          class="toolbarButton labeled"
                          type="button"
                          title="Add new signature"
                          tabindex="0"
                          data-l10n-id="pdfjs-editor-signature-add-signature-button"
                        >
                          <span
                            data-l10n-id="pdfjs-editor-signature-add-signature-button-label"
                            class="editorParamsLabel"
                          >
                            Add new signature
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    id="editorMergeTools"
                    class="toolbarButtonWithContainer"
                    style={{ display: "flex" }}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={onFileChange}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        mergePDFs();
                      }}
                      style={{
                        width: "100px",
                      }}
                    >
                      Merge 2 pdf
                    </button>
                  </div>
                  <div id="editorHighlight" class="toolbarButtonWithContainer">
                    <button
                      id="editorHighlightButton"
                      class="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Highlight"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorHighlightParamsToolbar"
                      tabindex="0"
                      data-l10n-id="pdfjs-editor-highlight-button"
                    >
                      <span data-l10n-id="pdfjs-editor-highlight-button-label">
                        Highlight
                      </span>
                    </button>
                    <div
                      class="editorParamsToolbar hidden doorHangerRight"
                      id="editorHighlightParamsToolbar"
                    >
                      <div
                        id="highlightParamsToolbarContainer"
                        class="editorParamsToolbarContainer"
                      >
                        <div
                          id="editorHighlightColorPicker"
                          class="colorPicker"
                        >
                          <span
                            id="highlightColorPickerLabel"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-highlight-colorpicker-label"
                          >
                            Highlight color
                          </span>
                        </div>
                        <div id="editorHighlightThickness">
                          <label
                            for="editorFreeHighlightThickness"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-highlight-thickness-input"
                          >
                            Thickness
                          </label>
                          <div class="thicknessPicker">
                            <input
                              type="range"
                              id="editorFreeHighlightThickness"
                              class="editorParamsSlider"
                              data-l10n-id="pdfjs-editor-free-highlight-thickness-title"
                              value="12"
                              min="8"
                              max="24"
                              step="1"
                              tabindex="0"
                            />
                          </div>
                        </div>
                        <div id="editorHighlightVisibility">
                          <div class="divider"></div>
                          <div class="toggler">
                            <label
                              for="editorHighlightShowAll"
                              class="editorParamsLabel"
                              data-l10n-id="pdfjs-editor-highlight-show-all-button-label"
                            >
                              Show all
                            </label>
                            <button
                              id="editorHighlightShowAll"
                              class="toggle-button"
                              type="button"
                              data-l10n-id="pdfjs-editor-highlight-show-all-button"
                              aria-pressed="true"
                              tabindex="0"
                            ></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorFreeText" class="toolbarButtonWithContainer">
                    <button
                      id="editorFreeTextButton"
                      class="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Text"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorFreeTextParamsToolbar"
                      tabindex="0"
                      data-l10n-id="pdfjs-editor-free-text-button"
                    >
                      <span data-l10n-id="pdfjs-editor-free-text-button-label">
                        Text
                      </span>
                    </button>
                    <div
                      class="editorParamsToolbar hidden doorHangerRight"
                      id="editorFreeTextParamsToolbar"
                    >
                      <div class="editorParamsToolbarContainer">
                        <div class="editorParamsSetter">
                          <label
                            for="editorFreeTextColor"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-text-color-input"
                          >
                            Color
                          </label>
                          <input
                            type="color"
                            id="editorFreeTextColor"
                            class="editorParamsColor"
                            tabindex="0"
                          />
                        </div>
                        <div class="editorParamsSetter">
                          <label
                            for="editorFreeTextFontSize"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-text-size-input"
                          >
                            Size
                          </label>
                          <input
                            type="range"
                            id="editorFreeTextFontSize"
                            class="editorParamsSlider"
                            value="10"
                            min="5"
                            max="100"
                            step="1"
                            tabindex="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorInk" class="toolbarButtonWithContainer">
                    <button
                      id="editorInkButton"
                      class="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Draw"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorInkParamsToolbar"
                      tabindex="0"
                      data-l10n-id="pdfjs-editor-ink-button"
                    >
                      <span data-l10n-id="pdfjs-editor-ink-button-label">
                        Draw
                      </span>
                    </button>
                    <div
                      class="editorParamsToolbar hidden doorHangerRight"
                      id="editorInkParamsToolbar"
                    >
                      <div class="editorParamsToolbarContainer">
                        <div class="editorParamsSetter">
                          <label
                            for="editorInkColor"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-color-input"
                          >
                            Color
                          </label>
                          <input
                            type="color"
                            id="editorInkColor"
                            class="editorParamsColor"
                            tabindex="0"
                          />
                        </div>
                        <div class="editorParamsSetter">
                          <label
                            for="editorInkThickness"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-thickness-input"
                          >
                            Thickness
                          </label>
                          <input
                            type="range"
                            id="editorInkThickness"
                            class="editorParamsSlider"
                            value="1"
                            min="1"
                            max="20"
                            step="1"
                            tabindex="0"
                          />
                        </div>
                        <div class="editorParamsSetter">
                          <label
                            for="editorInkOpacity"
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-opacity-input"
                          >
                            Opacity
                          </label>
                          <input
                            type="range"
                            id="editorInkOpacity"
                            class="editorParamsSlider"
                            value="1"
                            min="0.05"
                            max="1"
                            step="0.05"
                            tabindex="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorStamp" class="toolbarButtonWithContainer">
                    <button
                      id="editorStampButton"
                      class="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Add or edit images"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorStampParamsToolbar"
                      tabindex="0"
                      data-l10n-id="pdfjs-editor-stamp-button"
                    >
                      <span data-l10n-id="pdfjs-editor-stamp-button-label">
                        Add or edit images
                      </span>
                    </button>
                    <div
                      class="editorParamsToolbar hidden doorHangerRight menu"
                      id="editorStampParamsToolbar"
                    >
                      <div class="menuContainer">
                        <button
                          id="editorStampAddImage"
                          class="toolbarButton labeled"
                          type="button"
                          title="Add image"
                          tabindex="0"
                          data-l10n-id="pdfjs-editor-stamp-add-image-button"
                        >
                          <span
                            class="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-stamp-add-image-button-label"
                          >
                            Add image
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="editorModeSeparator"
                  class="verticalToolbarSeparator"
                ></div>

                <div class="toolbarHorizontalGroup hiddenMediumView">
                  <button
                    id="printButton"
                    class="toolbarButton"
                    type="button"
                    title="Print"
                    tabindex="0"
                    data-l10n-id="pdfjs-print-button"
                  >
                    <span data-l10n-id="pdfjs-print-button-label">Print</span>
                  </button>

                  <button
                    id="downloadButton"
                    class="toolbarButton"
                    type="button"
                    title="Save"
                    tabindex="0"
                    data-l10n-id="pdfjs-save-button"
                  >
                    <span data-l10n-id="pdfjs-save-button-label">Save</span>
                  </button>
                </div>

                <div class="verticalToolbarSeparator hiddenMediumView"></div>

                <div
                  id="secondaryToolbarToggle"
                  class="toolbarButtonWithContainer"
                >
                  <button
                    id="secondaryToolbarToggleButton"
                    class="toolbarButton"
                    type="button"
                    title="Tools"
                    tabindex="0"
                    data-l10n-id="pdfjs-tools-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-controls="secondaryToolbar"
                  >
                    <span data-l10n-id="pdfjs-tools-button-label">Tools</span>
                  </button>
                  <div
                    id="secondaryToolbar"
                    class="hidden doorHangerRight menu"
                  >
                    <div
                      id="secondaryToolbarButtonContainer"
                      class="menuContainer"
                    >
                      <button
                        id="secondaryOpenFile"
                        class="toolbarButton labeled"
                        type="button"
                        title="Open File"
                        tabindex="0"
                        data-l10n-id="pdfjs-open-file-button"
                      >
                        <span data-l10n-id="pdfjs-open-file-button-label">
                          Open
                        </span>
                      </button>

                      <div class="visibleMediumView">
                        <button
                          id="secondaryPrint"
                          class="toolbarButton labeled"
                          type="button"
                          title="Print"
                          tabindex="0"
                          data-l10n-id="pdfjs-print-button"
                        >
                          <span data-l10n-id="pdfjs-print-button-label">
                            Print
                          </span>
                        </button>

                        <button
                          id="secondaryDownload"
                          class="toolbarButton labeled"
                          type="button"
                          title="Save"
                          tabindex="0"
                          data-l10n-id="pdfjs-save-button"
                        >
                          <span data-l10n-id="pdfjs-save-button-label">
                            Save
                          </span>
                        </button>

                        <div class="horizontalToolbarSeparator"></div>
                      </div>

                      <div class="horizontalToolbarSeparator"></div>

                      <button
                        id="presentationMode"
                        class="toolbarButton labeled"
                        type="button"
                        title="Switch to Presentation Mode"
                        tabindex="0"
                        data-l10n-id="pdfjs-presentation-mode-button"
                      >
                        <span data-l10n-id="pdfjs-presentation-mode-button-label">
                          Presentation Mode
                        </span>
                      </button>

                      <a
                        href="#"
                        id="viewBookmark"
                        class="toolbarButton labeled"
                        title="Current Page (View URL from Current Page)"
                        tabindex="0"
                        data-l10n-id="pdfjs-bookmark-button"
                      >
                        <span data-l10n-id="pdfjs-bookmark-button-label">
                          Current Page
                        </span>
                      </a>

                      <div
                        id="viewBookmarkSeparator"
                        class="horizontalToolbarSeparator"
                      ></div>

                      <button
                        id="firstPage"
                        class="toolbarButton labeled"
                        type="button"
                        title="Go to First Page"
                        tabindex="0"
                        data-l10n-id="pdfjs-first-page-button"
                      >
                        <span data-l10n-id="pdfjs-first-page-button-label">
                          Go to First Page
                        </span>
                      </button>
                      <button
                        id="lastPage"
                        class="toolbarButton labeled"
                        type="button"
                        title="Go to Last Page"
                        tabindex="0"
                        data-l10n-id="pdfjs-last-page-button"
                      >
                        <span data-l10n-id="pdfjs-last-page-button-label">
                          Go to Last Page
                        </span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <button
                        id="pageRotateCw"
                        class="toolbarButton labeled"
                        type="button"
                        title="Rotate Clockwise"
                        tabindex="0"
                        data-l10n-id="pdfjs-page-rotate-cw-button"
                      >
                        <span data-l10n-id="pdfjs-page-rotate-cw-button-label">
                          Rotate Clockwise
                        </span>
                      </button>
                      <button
                        id="pageRotateCcw"
                        class="toolbarButton labeled"
                        type="button"
                        title="Rotate Counterclockwise"
                        tabindex="0"
                        data-l10n-id="pdfjs-page-rotate-ccw-button"
                      >
                        <span data-l10n-id="pdfjs-page-rotate-ccw-button-label">
                          Rotate Counterclockwise
                        </span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="cursorToolButtons" role="radiogroup">
                        <button
                          id="cursorSelectTool"
                          class="toolbarButton labeled toggled"
                          type="button"
                          title="Enable Text Selection Tool"
                          tabindex="0"
                          data-l10n-id="pdfjs-cursor-text-select-tool-button"
                          role="radio"
                          aria-checked="true"
                        >
                          <span data-l10n-id="pdfjs-cursor-text-select-tool-button-label">
                            Text Selection Tool
                          </span>
                        </button>
                        <button
                          id="cursorHandTool"
                          class="toolbarButton labeled"
                          type="button"
                          title="Enable Hand Tool"
                          tabindex="0"
                          data-l10n-id="pdfjs-cursor-hand-tool-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-cursor-hand-tool-button-label">
                            Hand Tool
                          </span>
                        </button>
                      </div>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="scrollModeButtons" role="radiogroup">
                        <button
                          id="scrollPage"
                          class="toolbarButton labeled"
                          type="button"
                          title="Use Page Scrolling"
                          tabindex="0"
                          data-l10n-id="pdfjs-scroll-page-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-scroll-page-button-label">
                            Page Scrolling
                          </span>
                        </button>
                        <button
                          id="scrollVertical"
                          class="toolbarButton labeled toggled"
                          type="button"
                          title="Use Vertical Scrolling"
                          tabindex="0"
                          data-l10n-id="pdfjs-scroll-vertical-button"
                          role="radio"
                          aria-checked="true"
                        >
                          <span data-l10n-id="pdfjs-scroll-vertical-button-label">
                            Vertical Scrolling
                          </span>
                        </button>
                        <button
                          id="scrollHorizontal"
                          class="toolbarButton labeled"
                          type="button"
                          title="Use Horizontal Scrolling"
                          tabindex="0"
                          data-l10n-id="pdfjs-scroll-horizontal-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-scroll-horizontal-button-label">
                            Horizontal Scrolling
                          </span>
                        </button>
                        <button
                          id="scrollWrapped"
                          class="toolbarButton labeled"
                          type="button"
                          title="Use Wrapped Scrolling"
                          tabindex="0"
                          data-l10n-id="pdfjs-scroll-wrapped-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-scroll-wrapped-button-label">
                            Wrapped Scrolling
                          </span>
                        </button>
                      </div>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="spreadModeButtons" role="radiogroup">
                        <button
                          id="spreadNone"
                          class="toolbarButton labeled toggled"
                          type="button"
                          title="Do not join page spreads"
                          tabindex="0"
                          data-l10n-id="pdfjs-spread-none-button"
                          role="radio"
                          aria-checked="true"
                        >
                          <span data-l10n-id="pdfjs-spread-none-button-label">
                            No Spreads
                          </span>
                        </button>
                        <button
                          id="spreadOdd"
                          class="toolbarButton labeled"
                          type="button"
                          title="Join page spreads starting with odd-numbered pages"
                          tabindex="0"
                          data-l10n-id="pdfjs-spread-odd-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-spread-odd-button-label">
                            Odd Spreads
                          </span>
                        </button>
                        <button
                          id="spreadEven"
                          class="toolbarButton labeled"
                          type="button"
                          title="Join page spreads starting with even-numbered pages"
                          tabindex="0"
                          data-l10n-id="pdfjs-spread-even-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-spread-even-button-label">
                            Even Spreads
                          </span>
                        </button>
                      </div>

                      <div
                        id="imageAltTextSettingsSeparator"
                        class="horizontalToolbarSeparator hidden"
                      ></div>
                      <button
                        id="imageAltTextSettings"
                        type="button"
                        class="toolbarButton labeled hidden"
                        title="Image alt text settings"
                        tabindex="0"
                        data-l10n-id="pdfjs-image-alt-text-settings-button"
                        aria-controls="altTextSettingsDialog"
                      >
                        <span data-l10n-id="pdfjs-image-alt-text-settings-button-label">
                          Image alt text settings
                        </span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <button
                        id="documentProperties"
                        class="toolbarButton labeled"
                        type="button"
                        title="Document Properties…"
                        tabindex="0"
                        data-l10n-id="pdfjs-document-properties-button"
                        aria-controls="documentPropertiesDialog"
                      >
                        <span data-l10n-id="pdfjs-document-properties-button-label">
                          Document Properties…
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="loadingBar">
              <div class="progress">
                <div class="glimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabindex="0">
          <div id="viewer" class="pdfViewer"></div>
        </div>
      </div>
    </div>
  );
};

export default AppComp;
