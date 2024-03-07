import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";
import { NextRequest } from "next/server";
import { actionsType } from "../add/page";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // console.log("🚀 ✔ POST ✔ body:", body);

  const { link, title, selector, selectorName, selectorType } = body.options;
  const actions = body.actions;

  let test = new Invoker();

  test.setOnStart(new loadBrowserAction());
  test.setOnEnd(new closeBrowserAction());
  test.addAction("openNewPage", link);

  actions.forEach((action: actionsType) => {
    if (action.actionName == "addExtractType" && action.params !== null) {
      console.log("action.params", action.params);
      test.addAction(
        "addExtractType",
        action?.params.selector,
        action?.params.name,
        action?.params.type,
        action?.params.filter,
      );
    }
  });

  test.addAction("addTitle", title);
  test.addAction("page$$", selector, selectorType, selectorName);
  test.addAction("evaluateElements");
  // test.addAction("printResult");

  let done = false;

  // test.addToDatabase();
  const res = new Response(
    new ReadableStream({
      async start(controller) {
        const timer = setInterval(() => {
          try {
            const percent = test.state.progress;

            controller.enqueue(percent.toString());
            if (done) {
              controller.enqueue(JSON.stringify({ result: test.state.result }));
              clearInterval(timer);
              controller.close();
            }
            console.log("💢");
          } catch (e) {
            clearInterval(timer);
            controller.close();
          }
        }, 400);
        try {
          await test.activate();
        } catch (err) {
          if (err instanceof Error)
            controller.enqueue(JSON.stringify({ error: err.message }));
          clearInterval(timer);
          controller.close();
        }
        console.log(test.state.result.at(-1));
        done = true;
      },
    }),
    {
      status: 200,
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      //   "Access-Control-Allow-Headers": "Content-Type, Authorization",
      // },
    },
  );
  return res;

  // return new Response(JSON.stringify(resData));
}
