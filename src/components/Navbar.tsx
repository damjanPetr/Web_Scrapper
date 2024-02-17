import Link from "next/link";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <div className="container  mx-auto mb-20 flex items-center justify-between bg-blue-200 px-10 py-4  ">
      {/* logo */}
      <div className="text-2xl font-bold ">
        <Link href={"/"}>Web Scrapper</Link>
      </div>
      <nav className="">
        <ul className="flex gap-10 text-xl">
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Navbar;
