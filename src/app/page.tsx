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
    <div className="p-1">
      <div className="hero mt-20 bg-pink-900 p-10">
        <div className="bg-blue-200"></div>
        <div className="bg-green-200"></div>
      </div>
      <div className="">
        <div className="widget fixed bottom-0 left-0 w-full  p-20">
          <div className="window_popup">
            <div className="l ">
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
            </div>
            <div className="r ">
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
