import { Metadata } from "next";

import Link from "next/link";
import PopupBars from "../components/PopupBars";
import db from "../database/Database";

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
    <div className="overflow-hidden rounded  p-1 text-foreground ">
      <div className="hero mt-60  rounded bg-background p-10">
        <div className="   bg-background p-4 text-foreground">
          <h1 className="text-3xl "> Grab Context Easily</h1>

          <h2 className="text-1xl mt-4">Empower Your Data</h2>
          <p className="mt-10">Unlock the full potential of the internet.</p>
          <p>Reliable, structured data:</p>
          <p>Tailored to your business needs:</p>
          <div className="mt-8 ">
            <Link
              className="border-lg mt-10 rounded bg-secondary p-2 text-xl text-secondary-foreground "
              href={"/add"}
            >
              Try it out right now
            </Link>
          </div>
        </div>
        <div className="bg-background p-4 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ullam
          tempora eum alias doloremque molestiae distinctio quasi eveniet
          inventore illo.
        </div>
      </div>
      <PopupBars />
    </div>
  );
}

export default Home;
