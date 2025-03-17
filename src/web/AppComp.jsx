import React, { useEffect } from "react";
import * as pdfjsLib from "pdfjs-lib";

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
import "./viewer.js";

const worker = new URL("pdfjs-lib/build/pdf.worker.mjs", import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
import "../web/viewer.css";

import monkeyTrace from "../../test/pdfs/tracemonkey.pdf";

const AppComp = () => {
  const loadFile = async () => {
    // Loading a document.
    const loadingTask = pdfjsLib.getDocument(monkeyTrace);
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

  useEffect(() => {
    // loadFile();
  }, []);

  return (
    <div id="outerContainer">
      <div id="sidebarContainer">
        <div id="toolbarSidebar" className="toolbarHorizontalGroup">
          <div id="toolbarSidebarLeft">
            <div
              id="sidebarViewButtons"
              className="toolbarHorizontalGroup toggled"
              role="radiogroup"
            >
              <button
                id="viewThumbnail"
                className="toolbarButton toggled"
                type="button"
                title="Show Thumbnails"
                tabIndex="0"
                data-l10n-id="pdfjs-thumbs-button"
                role="radio"
                aria-checked="true"
                aria-controls="thumbnailView"
              >
                <span data-l10n-id="pdfjs-thumbs-button-label">Thumbnails</span>
              </button>
              <button
                id="viewOutline"
                className="toolbarButton"
                type="button"
                title="Show Document Outline (double-click to expand/collapse all items)"
                tabIndex="0"
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
                className="toolbarButton"
                type="button"
                title="Show Attachments"
                tabIndex="0"
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
                className="toolbarButton"
                type="button"
                title="Show Layers (double-click to reset all layers to the default state)"
                tabIndex="0"
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
            <div
              id="outlineOptionsContainer"
              className="toolbarHorizontalGroup"
            >
              <div className="verticalToolbarSeparator"></div>

              <button
                id="currentOutlineItem"
                className="toolbarButton"
                type="button"
                disabled="disabled"
                title="Find Current Outline Item"
                tabIndex="0"
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
          <div id="outlineView" className="hidden"></div>
          <div id="attachmentsView" className="hidden"></div>
          <div id="layersView" className="hidden"></div>
        </div>
        <div id="sidebarResizer"></div>
      </div>

      <div id="mainContainer">
        <div className="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer" className="toolbarHorizontalGroup">
              <div id="toolbarViewerLeft" className="toolbarHorizontalGroup">
                <button
                  id="sidebarToggleButton"
                  className="toolbarButton"
                  type="button"
                  title="Toggle Sidebar"
                  tabIndex="0"
                  data-l10n-id="pdfjs-toggle-sidebar-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  aria-controls="sidebarContainer"
                >
                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label">
                    Toggle Sidebar
                  </span>
                </button>
                <div className="toolbarButtonSpacer"></div>
                <div className="toolbarButtonWithContainer">
                  <button
                    id="viewFindButton"
                    className="toolbarButton"
                    type="button"
                    title="Find in Document"
                    tabIndex="0"
                    data-l10n-id="pdfjs-findbar-button"
                    aria-expanded="false"
                    aria-controls="findbar"
                  >
                    <span data-l10n-id="pdfjs-findbar-button-label">Find</span>
                  </button>
                  <div
                    className="hidden doorHanger toolbarHorizontalGroup"
                    id="findbar"
                  >
                    <div
                      id="findInputContainer"
                      className="toolbarHorizontalGroup"
                    >
                      <span className="loadingInput end toolbarHorizontalGroup">
                        <input
                          id="findInput"
                          className="toolbarField"
                          title="Find"
                          placeholder="Find in document…"
                          tabIndex="0"
                          data-l10n-id="pdfjs-find-input"
                          aria-invalid="false"
                        />
                      </span>
                      <div className="toolbarHorizontalGroup">
                        <button
                          id="findPreviousButton"
                          className="toolbarButton"
                          type="button"
                          title="Find the previous occurrence of the phrase"
                          tabIndex="0"
                          data-l10n-id="pdfjs-find-previous-button"
                        >
                          <span data-l10n-id="pdfjs-find-previous-button-label">
                            Previous
                          </span>
                        </button>
                        <div className="splitToolbarButtonSeparator"></div>
                        <button
                          id="findNextButton"
                          className="toolbarButton"
                          type="button"
                          title="Find the next occurrence of the phrase"
                          tabIndex="0"
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
                      className="toolbarHorizontalGroup"
                    >
                      <div className="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findHighlightAll"
                          tabIndex="0"
                        />
                        <label
                          for="findHighlightAll"
                          data-l10n-id="pdfjs-find-highlight-checkbox"
                        >
                          Highlight All
                        </label>
                      </div>
                      <div className="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findMatchCase"
                          tabIndex="0"
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
                      className="toolbarHorizontalGroup"
                    >
                      <div className="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findMatchDiacritics"
                          tabIndex="0"
                        />
                        <label
                          for="findMatchDiacritics"
                          data-l10n-id="pdfjs-find-match-diacritics-checkbox-label"
                        >
                          Match Diacritics
                        </label>
                      </div>
                      <div className="toggleButton toolbarLabel">
                        <input
                          type="checkbox"
                          id="findEntireWord"
                          tabIndex="0"
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
                      className="toolbarHorizontalGroup"
                      aria-live="polite"
                    >
                      <span
                        id="findResultsCount"
                        className="toolbarLabel"
                      ></span>
                      <span id="findMsg" className="toolbarLabel"></span>
                    </div>
                  </div>
                </div>
                <div className="toolbarHorizontalGroup hiddenSmallView">
                  <button
                    className="toolbarButton"
                    title="Previous Page"
                    type="button"
                    id="previous"
                    tabIndex="0"
                    data-l10n-id="pdfjs-previous-button"
                  >
                    <span data-l10n-id="pdfjs-previous-button-label">
                      Previous
                    </span>
                  </button>
                  <div className="splitToolbarButtonSeparator"></div>
                  <button
                    className="toolbarButton"
                    type="button"
                    title="Next Page"
                    id="next"
                    tabIndex="0"
                    data-l10n-id="pdfjs-next-button"
                  >
                    <span data-l10n-id="pdfjs-next-button-label">Next</span>
                  </button>
                </div>
                <div className="toolbarHorizontalGroup">
                  <span className="loadingInput start toolbarHorizontalGroup">
                    <input
                      type="number"
                      id="pageNumber"
                      className="toolbarField"
                      title="Page"
                      value="1"
                      min="1"
                      tabIndex="0"
                      data-l10n-id="pdfjs-page-input"
                      autoComplete="off"
                    />
                  </span>
                  <span id="numPages" className="toolbarLabel"></span>
                </div>
              </div>
              <div id="toolbarViewerMiddle" className="toolbarHorizontalGroup">
                <div className="toolbarHorizontalGroup">
                  <button
                    id="zoomOutButton"
                    className="toolbarButton"
                    type="button"
                    title="Zoom Out"
                    tabIndex="0"
                    data-l10n-id="pdfjs-zoom-out-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-out-button-label">
                      Zoom Out
                    </span>
                  </button>
                  <div className="splitToolbarButtonSeparator"></div>
                  <button
                    id="zoomInButton"
                    className="toolbarButton"
                    type="button"
                    title="Zoom In"
                    tabIndex="0"
                    data-l10n-id="pdfjs-zoom-in-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-in-button-label">
                      Zoom In
                    </span>
                  </button>
                </div>
                <span
                  id="scaleSelectContainer"
                  className="dropdownToolbarButton"
                >
                  <select
                    id="scaleSelect"
                    title="Zoom"
                    tabIndex="0"
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
              <div id="toolbarViewerRight" className="toolbarHorizontalGroup">
                <div
                  id="editorModeButtons"
                  className="toolbarHorizontalGroup"
                  role="radiogroup"
                >
                  <div
                    id="editorSignature"
                    className="toolbarButtonWithContainer"
                    hidden="true"
                  >
                    <button
                      id="editorSignatureButton"
                      className="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Add signature"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorSignatureParamsToolbar"
                      tabIndex="0"
                      data-l10n-id="pdfjs-editor-signature-button"
                    >
                      <span data-l10n-id="pdfjs-editor-signature-button-label">
                        Add signature
                      </span>
                    </button>
                    <div
                      className="editorParamsToolbar hidden doorHangerRight menu"
                      id="editorSignatureParamsToolbar"
                    >
                      <div
                        id="addSignatureDoorHanger"
                        className="menuContainer"
                      >
                        <button
                          id="editorSignatureAddSignature"
                          className="toolbarButton labeled"
                          type="button"
                          title="Add new signature"
                          tabIndex="0"
                          data-l10n-id="pdfjs-editor-signature-add-signature-button"
                        >
                          <span
                            data-l10n-id="pdfjs-editor-signature-add-signature-button-label"
                            className="editorParamsLabel"
                          >
                            Add new signature
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    id="editorHighlight"
                    className="toolbarButtonWithContainer"
                  >
                    <button
                      id="editorHighlightButton"
                      className="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Highlight"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorHighlightParamsToolbar"
                      tabIndex="0"
                      data-l10n-id="pdfjs-editor-highlight-button"
                    >
                      <span data-l10n-id="pdfjs-editor-highlight-button-label">
                        Highlight
                      </span>
                    </button>
                    <div
                      className="editorParamsToolbar hidden doorHangerRight"
                      id="editorHighlightParamsToolbar"
                    >
                      <div
                        id="highlightParamsToolbarContainer"
                        className="editorParamsToolbarContainer"
                      >
                        <div
                          id="editorHighlightColorPicker"
                          className="colorPicker"
                        >
                          <span
                            id="highlightColorPickerLabel"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-highlight-colorpicker-label"
                          >
                            Highlight color
                          </span>
                        </div>
                        <div id="editorHighlightThickness">
                          <label
                            for="editorFreeHighlightThickness"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-highlight-thickness-input"
                          >
                            Thickness
                          </label>
                          <div className="thicknessPicker">
                            <input
                              type="range"
                              id="editorFreeHighlightThickness"
                              className="editorParamsSlider"
                              data-l10n-id="pdfjs-editor-free-highlight-thickness-title"
                              value="12"
                              min="8"
                              max="24"
                              step="1"
                              tabIndex="0"
                            />
                          </div>
                        </div>
                        <div id="editorHighlightVisibility">
                          <div className="divider"></div>
                          <div className="toggler">
                            <label
                              for="editorHighlightShowAll"
                              className="editorParamsLabel"
                              data-l10n-id="pdfjs-editor-highlight-show-all-button-label"
                            >
                              Show all
                            </label>
                            <button
                              id="editorHighlightShowAll"
                              className="toggle-button"
                              type="button"
                              data-l10n-id="pdfjs-editor-highlight-show-all-button"
                              aria-pressed="true"
                              tabIndex="0"
                            ></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="editorFreeText"
                    className="toolbarButtonWithContainer"
                  >
                    <button
                      id="editorFreeTextButton"
                      className="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Text"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorFreeTextParamsToolbar"
                      tabIndex="0"
                      data-l10n-id="pdfjs-editor-free-text-button"
                    >
                      <span data-l10n-id="pdfjs-editor-free-text-button-label">
                        Text
                      </span>
                    </button>
                    <div
                      className="editorParamsToolbar hidden doorHangerRight"
                      id="editorFreeTextParamsToolbar"
                    >
                      <div className="editorParamsToolbarContainer">
                        <div className="editorParamsSetter">
                          <label
                            for="editorFreeTextColor"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-text-color-input"
                          >
                            Color
                          </label>
                          <input
                            type="color"
                            id="editorFreeTextColor"
                            className="editorParamsColor"
                            tabIndex="0"
                          />
                        </div>
                        <div className="editorParamsSetter">
                          <label
                            for="editorFreeTextFontSize"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-free-text-size-input"
                          >
                            Size
                          </label>
                          <input
                            type="range"
                            id="editorFreeTextFontSize"
                            className="editorParamsSlider"
                            value="10"
                            min="5"
                            max="100"
                            step="1"
                            tabIndex="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorInk" className="toolbarButtonWithContainer">
                    <button
                      id="editorInkButton"
                      className="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Draw"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorInkParamsToolbar"
                      tabIndex="0"
                      data-l10n-id="pdfjs-editor-ink-button"
                    >
                      <span data-l10n-id="pdfjs-editor-ink-button-label">
                        Draw
                      </span>
                    </button>
                    <div
                      className="editorParamsToolbar hidden doorHangerRight"
                      id="editorInkParamsToolbar"
                    >
                      <div className="editorParamsToolbarContainer">
                        <div className="editorParamsSetter">
                          <label
                            for="editorInkColor"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-color-input"
                          >
                            Color
                          </label>
                          <input
                            type="color"
                            id="editorInkColor"
                            className="editorParamsColor"
                            tabIndex="0"
                          />
                        </div>
                        <div className="editorParamsSetter">
                          <label
                            for="editorInkThickness"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-thickness-input"
                          >
                            Thickness
                          </label>
                          <input
                            type="range"
                            id="editorInkThickness"
                            className="editorParamsSlider"
                            value="1"
                            min="1"
                            max="20"
                            step="1"
                            tabIndex="0"
                          />
                        </div>
                        <div className="editorParamsSetter">
                          <label
                            for="editorInkOpacity"
                            className="editorParamsLabel"
                            data-l10n-id="pdfjs-editor-ink-opacity-input"
                          >
                            Opacity
                          </label>
                          <input
                            type="range"
                            id="editorInkOpacity"
                            className="editorParamsSlider"
                            value="1"
                            min="0.05"
                            max="1"
                            step="0.05"
                            tabIndex="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorStamp" className="toolbarButtonWithContainer">
                    <button
                      id="editorStampButton"
                      className="toolbarButton"
                      type="button"
                      disabled="disabled"
                      title="Add or edit images"
                      role="radio"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="editorStampParamsToolbar"
                      tabIndex="0"
                      data-l10n-id="pdfjs-editor-stamp-button"
                    >
                      <span data-l10n-id="pdfjs-editor-stamp-button-label">
                        Add or edit images
                      </span>
                    </button>
                    <div
                      className="editorParamsToolbar hidden doorHangerRight menu"
                      id="editorStampParamsToolbar"
                    >
                      <div className="menuContainer">
                        <button
                          id="editorStampAddImage"
                          className="toolbarButton labeled"
                          type="button"
                          title="Add image"
                          tabIndex="0"
                          data-l10n-id="pdfjs-editor-stamp-add-image-button"
                        >
                          <span
                            className="editorParamsLabel"
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
                  className="verticalToolbarSeparator"
                ></div>

                <div className="toolbarHorizontalGroup hiddenMediumView">
                  <button
                    id="printButton"
                    className="toolbarButton"
                    type="button"
                    title="Print"
                    tabIndex="0"
                    data-l10n-id="pdfjs-print-button"
                  >
                    <span data-l10n-id="pdfjs-print-button-label">Print</span>
                  </button>

                  <button
                    id="downloadButton"
                    className="toolbarButton"
                    type="button"
                    title="Save"
                    tabIndex="0"
                    data-l10n-id="pdfjs-save-button"
                  >
                    <span data-l10n-id="pdfjs-save-button-label">Save</span>
                  </button>
                </div>

                <div className="verticalToolbarSeparator hiddenMediumView"></div>

                <div
                  id="secondaryToolbarToggle"
                  className="toolbarButtonWithContainer"
                >
                  <button
                    id="secondaryToolbarToggleButton"
                    className="toolbarButton"
                    type="button"
                    title="Tools"
                    tabIndex="0"
                    data-l10n-id="pdfjs-tools-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-controls="secondaryToolbar"
                  >
                    <span data-l10n-id="pdfjs-tools-button-label">Tools</span>
                  </button>
                  <div
                    id="secondaryToolbar"
                    className="hidden doorHangerRight menu"
                  >
                    <div
                      id="secondaryToolbarButtonContainer"
                      className="menuContainer"
                    >
                      <button
                        id="secondaryOpenFile"
                        className="toolbarButton labeled"
                        type="button"
                        title="Open File"
                        tabIndex="0"
                        data-l10n-id="pdfjs-open-file-button"
                      >
                        <span data-l10n-id="pdfjs-open-file-button-label">
                          Open
                        </span>
                      </button>

                      <div className="visibleMediumView">
                        <button
                          id="secondaryPrint"
                          className="toolbarButton labeled"
                          type="button"
                          title="Print"
                          tabIndex="0"
                          data-l10n-id="pdfjs-print-button"
                        >
                          <span data-l10n-id="pdfjs-print-button-label">
                            Print
                          </span>
                        </button>

                        <button
                          id="secondaryDownload"
                          className="toolbarButton labeled"
                          type="button"
                          title="Save"
                          tabIndex="0"
                          data-l10n-id="pdfjs-save-button"
                        >
                          <span data-l10n-id="pdfjs-save-button-label">
                            Save
                          </span>
                        </button>

                        <div className="horizontalToolbarSeparator"></div>
                      </div>

                      <div className="horizontalToolbarSeparator"></div>

                      <button
                        id="presentationMode"
                        className="toolbarButton labeled"
                        type="button"
                        title="Switch to Presentation Mode"
                        tabIndex="0"
                        data-l10n-id="pdfjs-presentation-mode-button"
                      >
                        <span data-l10n-id="pdfjs-presentation-mode-button-label">
                          Presentation Mode
                        </span>
                      </button>

                      <a
                        href="#"
                        id="viewBookmark"
                        className="toolbarButton labeled"
                        title="Current Page (View URL from Current Page)"
                        tabIndex="0"
                        data-l10n-id="pdfjs-bookmark-button"
                      >
                        <span data-l10n-id="pdfjs-bookmark-button-label">
                          Current Page
                        </span>
                      </a>

                      <div
                        id="viewBookmarkSeparator"
                        className="horizontalToolbarSeparator"
                      ></div>

                      <button
                        id="firstPage"
                        className="toolbarButton labeled"
                        type="button"
                        title="Go to First Page"
                        tabIndex="0"
                        data-l10n-id="pdfjs-first-page-button"
                      >
                        <span data-l10n-id="pdfjs-first-page-button-label">
                          Go to First Page
                        </span>
                      </button>
                      <button
                        id="lastPage"
                        className="toolbarButton labeled"
                        type="button"
                        title="Go to Last Page"
                        tabIndex="0"
                        data-l10n-id="pdfjs-last-page-button"
                      >
                        <span data-l10n-id="pdfjs-last-page-button-label">
                          Go to Last Page
                        </span>
                      </button>

                      <div className="horizontalToolbarSeparator"></div>

                      <button
                        id="pageRotateCw"
                        className="toolbarButton labeled"
                        type="button"
                        title="Rotate Clockwise"
                        tabIndex="0"
                        data-l10n-id="pdfjs-page-rotate-cw-button"
                      >
                        <span data-l10n-id="pdfjs-page-rotate-cw-button-label">
                          Rotate Clockwise
                        </span>
                      </button>
                      <button
                        id="pageRotateCcw"
                        className="toolbarButton labeled"
                        type="button"
                        title="Rotate Counterclockwise"
                        tabIndex="0"
                        data-l10n-id="pdfjs-page-rotate-ccw-button"
                      >
                        <span data-l10n-id="pdfjs-page-rotate-ccw-button-label">
                          Rotate Counterclockwise
                        </span>
                      </button>

                      <div className="horizontalToolbarSeparator"></div>

                      <div id="cursorToolButtons" role="radiogroup">
                        <button
                          id="cursorSelectTool"
                          className="toolbarButton labeled toggled"
                          type="button"
                          title="Enable Text Selection Tool"
                          tabIndex="0"
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
                          className="toolbarButton labeled"
                          type="button"
                          title="Enable Hand Tool"
                          tabIndex="0"
                          data-l10n-id="pdfjs-cursor-hand-tool-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-cursor-hand-tool-button-label">
                            Hand Tool
                          </span>
                        </button>
                      </div>

                      <div className="horizontalToolbarSeparator"></div>

                      <div id="scrollModeButtons" role="radiogroup">
                        <button
                          id="scrollPage"
                          className="toolbarButton labeled"
                          type="button"
                          title="Use Page Scrolling"
                          tabIndex="0"
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
                          className="toolbarButton labeled toggled"
                          type="button"
                          title="Use Vertical Scrolling"
                          tabIndex="0"
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
                          className="toolbarButton labeled"
                          type="button"
                          title="Use Horizontal Scrolling"
                          tabIndex="0"
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
                          className="toolbarButton labeled"
                          type="button"
                          title="Use Wrapped Scrolling"
                          tabIndex="0"
                          data-l10n-id="pdfjs-scroll-wrapped-button"
                          role="radio"
                          aria-checked="false"
                        >
                          <span data-l10n-id="pdfjs-scroll-wrapped-button-label">
                            Wrapped Scrolling
                          </span>
                        </button>
                      </div>

                      <div className="horizontalToolbarSeparator"></div>

                      <div id="spreadModeButtons" role="radiogroup">
                        <button
                          id="spreadNone"
                          className="toolbarButton labeled toggled"
                          type="button"
                          title="Do not join page spreads"
                          tabIndex="0"
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
                          className="toolbarButton labeled"
                          type="button"
                          title="Join page spreads starting with odd-numbered pages"
                          tabIndex="0"
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
                          className="toolbarButton labeled"
                          type="button"
                          title="Join page spreads starting with even-numbered pages"
                          tabIndex="0"
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
                        className="horizontalToolbarSeparator hidden"
                      ></div>
                      <button
                        id="imageAltTextSettings"
                        type="button"
                        className="toolbarButton labeled hidden"
                        title="Image alt text settings"
                        tabIndex="0"
                        data-l10n-id="pdfjs-image-alt-text-settings-button"
                        aria-controls="altTextSettingsDialog"
                      >
                        <span data-l10n-id="pdfjs-image-alt-text-settings-button-label">
                          Image alt text settings
                        </span>
                      </button>

                      <div className="horizontalToolbarSeparator"></div>

                      <button
                        id="documentProperties"
                        className="toolbarButton labeled"
                        type="button"
                        title="Document Properties…"
                        tabIndex="0"
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
              <div className="progress">
                <div className="glimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabIndex="0">
          <div id="viewer" className="pdfViewer"></div>
        </div>
      </div>
    </div>
  );
};

export default AppComp;
