"use client";

import useTheme from "@/contex/ThemeContex";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

function ThemeToogle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="toogle">
      {theme === "light" && (
        <Icon
          className="dark:hidden "
          onClick={() => setTheme("dark")}
          icon="mdi:theme-light-dark"
          width={24}
          height={24}
        />
      )}
      {theme === "dark" && (
        <Icon
          className=""
          icon="mdi:ab-testing"
          width={24}
          height={24}
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
}
export default ThemeToogle;
