import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { PrivyWalletProvider } from "./providers/PrivyWalletProvider";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrivyWalletProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <App />
      </ThemeProvider>
    </PrivyWalletProvider>
  </React.StrictMode>,
);
