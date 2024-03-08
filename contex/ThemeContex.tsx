"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themeContex = createContext<{ [key: string]: any }>({});

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  //TODO: fix darkmode

  // useEffect(() => {
  //   const storageTheme = localStorage.getItem("theme");
  //   const prefersDark = matchMedia("(prefers-color-scheme: dark)");
  //   const mode = prefersDark ? "dark" : "light";
  //   if (storageTheme != theme) {
  //     setTheme(storageTheme);
  //   }
  //   localStorage.setItem("theme", storageTheme);
  // }, [theme]);

  return (
    <themeContex.Provider value={{ theme, setTheme }}>
      <div className={`theme ${theme}`}>{children}</div>
    </themeContex.Provider>
  );
}

const useTheme = () => {
  const { theme, setTheme } = useContext(themeContex);

  return { theme, setTheme };
};

export default useTheme;
