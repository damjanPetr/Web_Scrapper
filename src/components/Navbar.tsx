import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="group relative z-10 mx-auto flex max-w-screen-2xl  items-center  justify-between  rounded-b  bg-background px-20  py-4 text-foreground ">
      {/* logo */}
      <div className="">
        <Link
          href={"/"}
          className="text-gradient dark:bounce flex gap-4 text-4xl "
        >
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
          />{" "}
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
