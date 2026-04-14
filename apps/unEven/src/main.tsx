import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../../../packages/ui/src/foundations/styles.css";
import { App } from "./app/App";
import { getAppRouterBasename } from "./app/routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter
      basename={
        typeof window === "undefined" ? "/" : getAppRouterBasename(window.location)
      }
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
