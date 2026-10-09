import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/quicksand/latin-400.css";
import "@fontsource/quicksand/latin-500.css";
import "@fontsource/quicksand/latin-600.css";
import "./styles/index.css";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
