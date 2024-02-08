"use client";
import { Metadata } from "next";
/* 
export const metadata: Metadata = {
  title: "Web Scrapper Homepage",
};
 */

function Home() {
  return (
    <div className="min-w-10 ">
      <main className="grid  grid-cols-2 bg-pink-100">
        <aside className=""></aside>
        <article className="">
          {/* Blogs */}
          <section>
            <form>
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
