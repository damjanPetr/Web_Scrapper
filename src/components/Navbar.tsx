import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";
import ThemeToogle from "./ThemeToogle";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="mx-auto mb-20 flex items-center justify-between bg-gradient-to-tr from-slate-700 to-foreground px-10  py-4 text-secondary   ">
      {/* logo */}
      <div className="text-2xl font-bold ">
        <Link href={"/"} className="text-gradient ">
          Web Scrapper
        </Link>
      </div>
      <nav className="flex items-center gap-8">
        <ul className="flex gap-10 text-xl">
          <li>
            <Link href={"/add"}>Add</Link>
          </li>
        </ul>
        <ThemeToogle />
      </nav>
    </div>
  );
}

export default Navbar;
