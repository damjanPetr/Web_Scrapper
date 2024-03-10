import { Metadata } from "next";

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
    <div className="mt-60 flex  items-center justify-center overflow-hidden rounded p-1 text-foreground ">
      <div className="hero   rounded bg-background p-10 ">
        <div className="gear absolute -right-12 -top-12    ">
          <Icon icon="eos-icons:rotating-gear" width={100} height={100} />
        </div>
        <div className="gear absolute -bottom-12 -left-12    ">
          <Icon icon="eos-icons:rotating-gear" width={100} height={100} />
        </div>
        <div className="   bg-background p-4 text-foreground">
          <h1 className="text-3xl "> Grab Context Easily</h1>

          <h2 className="text-1xl mt-4">Empower Your Data</h2>
          <p className="mt-10">Unlock the full potential of the internet.</p>
          <p>Reliable, structured data:</p>
          <p>Tailored to your business needs:</p>
        </div>
        <div className="bg-background p-4 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ullam
          tempora eum alias doloremque molestiae distinctio quasi eveniet
          inventore illo. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Necessitatibus itaque sed molestias optio, molestiae fugit quos
          nemo repudiandae distinctio reprehenderit.
          <div className="mt-8 ">
            <Link
              className="border-lg mt-10 rounded bg-secondary p-2 text-xl text-secondary-foreground "
              href={"/add"}
            >
              Try it out right now
            </Link>
          </div>
        </div>
      </div>

      <PopupBars />
    </div>
  );
}

export default Home;
