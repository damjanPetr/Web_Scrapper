import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="group relative z-10 mx-auto flex min-h-[90px]  max-w-screen-2xl  items-baseline justify-between  rounded-b  bg-background px-20  py-4 text-foreground ">
      {/* logo */}
      <div className="">
        <Link href={"/"} className="text-gradient  flex gap-4 text-5xl">
          <div className="logo flex items-center justify-center">
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
          </div>
          Scrapify
        </Link>
      </div>
      <nav className="flex items-center gap-8">
        {/* <ul className="flex gap-10 text-xl">
          <li>
            <Link href={"/add"}>Add</Link>
          </li>
        </ul> */}
        <ThemeToggle />
      </nav>
    </div>
  );
}

export default Navbar;
