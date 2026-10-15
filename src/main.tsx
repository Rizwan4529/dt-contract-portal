import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "@fontsource-variable/inter";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "react-day-picker/style.css";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { ThemeProvider } from "./hooks/useTheme";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          <App />
          <Toaster position="top-right" closeButton richColors />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
