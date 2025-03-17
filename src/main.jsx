
import AppComp from "./web/AppComp";

import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppComp />
    </React.StrictMode>
  );
}
