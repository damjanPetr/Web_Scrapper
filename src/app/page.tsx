import { Metadata } from "next";
import db from "../database/Database";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Web Scrapper Homepage",
};

async function Home() {
  const instance = await db.scrap_Instance.findMany({
    include: {
      actions: {
        include: {
          parameters: true,
        },
      },
      _count: true,
    },
  });

  // const map: { [key: string]: (typeof instance)[0] } = {};
  // instance.forEach((item) => {
  //   map[item.title] === undefined ? (map[item.title] = item) : "";
  // });
  // console.log(instance);

  return (
    <div className="">
      <div className="">
        <article className="">
          <section className="space-y-4">
            {instance.map((e) => {
              return (
                <div key={e.id} className="w-full rounded-lg bg-blue-50 p-4 ">
                  <div className="space-y-4 p-4">
                    <h1 className="text-2xl">
                      <span className="font-semibold">Title:</span> {e.title}
                    </h1>
                    <h1 className="text-2xl">
                      <span className="font-semibold">Link: </span> {e.url}
                    </h1>
                  </div>
                  <div className="bg-red-200">
                    <h2 className="bg-fuchsia-300  p-2 text-xl font-bold text-gray-700 ">
                      Actions
                    </h2>
                    <div className="">
                      {e.actions.map((action) => {
                        return (
                          <div key={action.id} className="grid grid-cols-2">
                            <p>{action.action}</p>
                            <div className="basis-1/2">
                              <h3 className="bg-gray-50 text-lg font-bold">
                                Parameters
                              </h3>
                              <div className="flex items-center gap-4  p-4">
                                {action.parameters.map((parameter) => {
                                  return (
                                    <div className="" key={parameter.id}>
                                      <div className="">{parameter.value}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <h2 className="  bg-fuchsia-700 p-2 text-xl font-bold text-white ">
                    Results
                  </h2>
                </div>
              );
            })}
          </section>
        </article>
      </div>
    </div>
  );
}

export default Home;
