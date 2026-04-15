import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../../../packages/ui/src/foundations/styles.css";
import { App } from "./app/App";
import { getAppRouterBasename } from "./app/routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={getAppRouterBasename(import.meta.env.BASE_URL)}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
