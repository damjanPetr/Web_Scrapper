import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";

function Footer() {
  return (
    <footer className="mx-auto flex max-w-screen-2xl justify-center bg-background p-4 text-foreground  ">
      <div className="flex flex-col items-center gap-10 sm:flex-row">
        <p className="ml-auto w-fit">Made with ❤️ </p>
        <div className="group flex items-center">
          <Link href="https://github.com/damjanPetr/Web_Scrapper">
            <Icon
              className="ml-2 transition-transform hover:scale-110"
              icon="mdi:github"
              width={30}
              height={30}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
