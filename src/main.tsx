import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { PrivyWalletProvider } from "./providers/PrivyWalletProvider";
import { LoginModalProvider } from "./providers/LoginModalProvider";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrivyWalletProvider>
      <LoginModalProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <App />
        </ThemeProvider>
      </LoginModalProvider>
    </PrivyWalletProvider>
  </React.StrictMode>,
);
