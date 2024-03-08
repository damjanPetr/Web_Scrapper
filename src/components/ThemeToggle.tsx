"use client";

import useTheme from "@/contex/ThemeContex";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="toogle">
      {theme === "light" && (
        <Icon
          className="dark:hidden "
          onClick={() => setTheme("dark")}
          icon="material-symbols:dark-mode"
          width={24}
          height={24}
        />
      )}
      {theme === "dark" && (
        <Icon
          className=""
          icon="material-symbols:light-mode"
          width={24}
          height={24}
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
}
export default ThemeToggle;
