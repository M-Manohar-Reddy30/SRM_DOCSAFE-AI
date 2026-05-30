import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>

    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,

        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "16px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
        },

        success: {
          duration: 3000,
        },

        error: {
          duration: 4000,
        },
      }}
    />

  </StrictMode>
);