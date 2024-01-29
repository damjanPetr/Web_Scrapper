import Link from "next/link";

type Props = {
  children?: React.ReactNode;
};
function Navbar({ children }: Props) {
  return (
    <div className=" bg-blue-200 py-2 px-8 flex justify-between items-center">
      {/* logo */}
      <div className="font-bold text-2xl ">
        <Link href={"/"}>Web Scrapper</Link>
      </div>
      <nav className="">
        <ul className="flex gap-4">
          <li>hueotnat</li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Navbar;
