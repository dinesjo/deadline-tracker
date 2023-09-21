import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/inter";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { extendTheme } from "@mui/joy/styles";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#3c1a70",
          solidBg: "var(--joy-palette-purple-700)",
          solidHoverBg: "var(--joy-palette-purple-800)",
          solidActiveBg: "var(--joy-palette-purple-900)",
          solidColor: "var(--joy-palette-purple-50)",
          outlinedBorder: "var(--joy-palette-purple-400)",
          outlinedHoverBg: "var(--joy-palette-purple-50)",
          outlinedActiveBg: "var(--joy-palette-purple-900)",
          outlinedColor: "var(--joy-palette-purple-600)",
        },
        brown: {
          50: "#efebe9",
          100: "#d7ccc8",
          200: "#bcaaa4",
          300: "#a1887f",
          400: "#8d6e63",
          500: "#795548",
          600: "#6d4c41",
          700: "#5d4037",
          800: "#4e342e",
          900: "#3e2723",
          950: "#2e1b16",
          solidBg: "var(--joy-palette-brown-700)",
          solidHoverBg: "var(--joy-palette-brown-800)",
          solidActiveBg: "var(--joy-palette-brown-900)",
          solidColor: "var(--joy-palette-brown-50)",
          outlinedBorder: "var(--joy-palette-brown-400)",
          outlinedHoverBg: "var(--joy-palette-brown-50)",
          outlinedActiveBg: "var(--joy-palette-brown-900)",
          outlinedColor: "var(--joy-palette-brown-600)",
        },
      },
    },
    dark: {
      palette: {
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#3c1a70",
          solidBg: "var(--joy-palette-purple-700)",
          solidHoverBg: "var(--joy-palette-purple-800)",
          solidActiveBg: "var(--joy-palette-purple-900)",
          solidColor: "var(--joy-palette-purple-50)",
          outlinedBorder: "var(--joy-palette-purple-900)",
          outlinedHoverBg: "var(--joy-palette-purple-950)",
          outlinedActiveBg: "var(--joy-palette-purple-900)",
          outlinedColor: "var(--joy-palette-purple-200)",
        },
        brown: {
          50: "#efebe9",
          100: "#d7ccc8",
          200: "#bcaaa4",
          300: "#a1887f",
          400: "#8d6e63",
          500: "#795548",
          600: "#6d4c41",
          700: "#5d4037",
          800: "#4e342e",
          900: "#3e2723",
          950: "#2e1b16",
          solidBg: "var(--joy-palette-brown-700)",
          solidHoverBg: "var(--joy-palette-brown-800)",
          solidActiveBg: "var(--joy-palette-brown-900)",
          solidColor: "var(--joy-palette-brown-50)",
          outlinedBorder: "var(--joy-palette-brown-700)",
          outlinedHoverBg: "var(--joy-palette-brown-950)",
          outlinedActiveBg: "var(--joy-palette-brown-900)",
          outlinedColor: "var(--joy-palette-brown-100)",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
