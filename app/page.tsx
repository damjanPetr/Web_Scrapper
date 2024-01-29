import Link from "next/link";
import Navbar from "./components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Scrapper Homepage",
};
function Home() {
  return (
    <div className="min-w-10 ">
      <main className="grid  grid-cols-2 bg-pink-100">
        <aside className=""></aside>
        <article className="">
          {/* Blogs */}
          <section>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            dolor laudantium itaque mollitia vel ipsum iste vitae corrupti,
            natus tempore a earum aliquid cupiditate officia quod reiciendis
            neque repellendus veniam.
          </section>
        </article>
      </main>
    </div>
  );
}
export default Home;
