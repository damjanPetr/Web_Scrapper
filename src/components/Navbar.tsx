import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="group mx-auto mb-20 flex max-w-screen-2xl  items-center  justify-between  bg-background  px-10 py-4 text-foreground  ">
      {/* logo */}
      <div className="flex gap-4 text-xl ">
        <Image
          src="/logo_black.svg"
          alt="logo"
          width={50}
          height={50}
          className="dark:hidden"
        />
        <Image
          src="/logo_white.svg"
          alt="logo"
          width={50}
          color="red"
          className="hidden dark:block"
          height={50}
        />
        <Link href={"/"} className="text-gradient dark:bounce text-4xl">
          Scrappify
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
