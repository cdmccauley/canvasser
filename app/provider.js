"use client";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Provider({ children }) {
  // for nextauth sessions on client
  return (
    <SessionProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
