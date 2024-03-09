import { Metadata } from "next";
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
    <div className="">
      <div className="">
        <article className="">
          <section className="space-y-4"></section>
        </article>
        <div className="window_popup ">
          <div className="l">
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
          </div>
          <div className="r">
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
