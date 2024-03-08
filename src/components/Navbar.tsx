import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="mx-auto mb-20 flex max-w-screen-2xl items-center  justify-between  bg-background  px-10  py-4 text-foreground   ">
      {/* logo */}
      <div className="text-2xl font-bold ">
        <Link href={"/"} className="text-gradient ">
          link Web Scrapper
        </Link>
      </div>
      <nav className="flex items-center gap-8">
        <ul className="flex gap-10 text-xl">
          <li>
            <Link href={"/add"}>Add</Link>
          </li>
        </ul>
        <ThemeToggle />
      </nav>
    </div>
  );
}

export default Navbar;
