"use client";
import { Metadata } from "next";
import { TextNode } from "./lib/Database";
/* 
export const metadata: Metadata = {
  title: "Web Scrapper Homepage",
};
 */
async function play() {
  console.log("hahah");
  const text = new TextNode("https://www.prisma.io/", ["h1"]);

  const node = await text.scrap();

  console.log(node);
}

function Home() {
  return (
    <div className="min-w-10 ">
      <main className="grid  grid-cols-2 bg-pink-100">
        <aside className=""></aside>
        <article className="">
          {/* Blogs */}
          <section>
            <form action={play}>
              <p className="text-red-500 text-lg font-bold">monkey</p>
              <button>play</button>
            </form>
          </section>
        </article>
      </main>
    </div>
  );
}
export default Home;
