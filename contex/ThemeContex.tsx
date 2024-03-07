"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const themeContex = createContext<{ [key: string]: any }>({});

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <themeContex.Provider value={{ theme, setTheme }}>
      {children}
    </themeContex.Provider>
  );
}

const useTheme = () => {
  const { theme, setTheme } = useContext(themeContex);
  if (theme === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  if (setTheme === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return { theme, setTheme };
};
export default useTheme;
