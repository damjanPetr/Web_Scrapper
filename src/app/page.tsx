import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PopupBars from "../components/PopupBars";
import db from "../database/Database";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

export const metadata: Metadata = {
  title: "Web Scrapper Homepage",
};

async function Home() {
  const instance = await db.scrap_Instance.findMany({
    include: {
      results: true,
      actions: {
        include: {
          parameters: true,
        },
      },
      _count: true,
    },
  });

  return (
    <div className="mt-[20vh] flex items-center justify-center overflow-hidden rounded text-foreground ">
      <div className="hero   rounded bg-background p-10 ">
        <div className="gear absolute -right-12 -top-12    ">
          <Icon icon="eos-icons:rotating-gear" width={100} height={100} />
        </div>
        <div className="gear absolute -bottom-12 -left-12    ">
          <Icon icon="eos-icons:rotating-gear" width={100} height={100} />
        </div>
        <div className="   bg-background p-4  text-foreground">
          <div className="text-center">
            <h1 className="  text-3xl font-extrabold">Grab Context Easily</h1>
            <h2 className="mt-4 text-2xl font-medium text-popover-foreground">
              Empower Your Data
            </h2>
          </div>

          <ul className="mt-8 list-inside list-disc space-y-10 text-lg marker:-ml-4 ">
            <li className="">Unlock the full potential of the internet.</li>
            <li>Reliable, structured data.</li>
            <li>Tailored to your business needs.</li>
            <li>Easy to use</li>
          </ul>
        </div>
        <div className="right rounded bg-white p-4 ring dark:bg-black">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-10 sm:flex-nowrap">
            <Image
              src="/undraw_data_extraction_re_0rd3.svg"
              alt="hero"
              width={150}
              height={120}
            />
            <Image
              src="/undraw_website_builder_re_ii6e.svg"
              alt="hero"
              width={150}
              height={120}
            />
            <Image
              src="/undraw_version_control_re_mg66.svg"
              alt="hero"
              width={150}
              height={120}
            />
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ullam
          tempora eum alias doloremque molestiae distinctio quasi eveniet
          inventore illo. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Necessitatibus itaque sed molestias optio, molestiae fugit quos
          nemo repudiandae distinctio reprehenderit.
          <div className="mt-8 flex items-center justify-center">
            <Link
              className="border-lg  rounded bg-blue-400 p-4 text-2xl text-white dark:bg-blue-700  "
              href={"/add"}
            >
              Grab Data{" "}
              <span className=" underline underline-offset-2 ">NOW</span>
            </Link>
          </div>
        </div>
      </div>

      <PopupBars />
    </div>
  );
}

export default Home;
