"use client";

import { createContext, useEffect, useState } from "react";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();
export const StateContext = createContext();

const themes = {
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
  light: createTheme({
    palette: {
      mode: "light",
    },
  }),
};

export default function Provider({ children }) {
  const [state, setState] = useState();
  const [theme, setTheme] = useState(themes.dark);
  const [light, setLight] = useState(false);

  useEffect(() => {
    light ? setTheme(themes.light) : setTheme(themes.dark);
  }, [light]);

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeContext.Provider
          value={{
            name: light ? "light" : "dark",
            switch: () => setLight(!light),
          }}
        >
          <StateContext.Provider value={{ ...state, set: setState }}>
            {children}
          </StateContext.Provider>
        </ThemeContext.Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
