import { Metadata } from "next";
import db from "../database/Database";
import Footer from "../components/Footer";
import PopupBars from "../components/PopupBars";

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
    <div className="overflow-hidden p-1 text-foreground ">
      <div className="hero mt-80 bg-pink-900 p-10">
        <div className="bg-blue-200 p-2 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ullam
          tempora eum alias doloremque molestiae distinctio quasi eveniet
          inventore illo.
        </div>
        <div className="bg-green-200">
          <h1 className="text-2xl"> Lorem, ipsum.</h1>
        </div>
      </div>
      <PopupBars />
    </div>
  );
}

export default Home;
