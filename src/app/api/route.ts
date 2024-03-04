import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";
import { NextRequest } from "next/server";
import { actionsType } from "../add/page";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("🚀 ✔ POST ✔ body:", body);

  const { link, title, selector, selectorName, selectorType } = body.options;
  const actions = body.actions;

  const test = new Invoker();

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

  // const resData = {
  //   result: test.state.result,
  // };
  // console.log(resData);

  // test.addToDatabase();
  return new Response(
    new ReadableStream({
      async start(controller) {
        let done = false;
        const interval = setInterval(() => {
          const percent = test.state.progress;
          try {
            if (done === true) {
              controller.enqueue(JSON.stringify({ result: test.state.result }));
              // controller.enqueue(JSON.stringify(resData));
              clearInterval(interval);
              controller.close();
            } else {
              controller.enqueue(percent.toString());
            }
          } catch (err) {
            if (err instanceof Error) console.log(err);
          } finally {
            clearInterval(interval);
          }
        }, 100);

        await test.activate();
      },
    }),
  );
  // return new Response(JSON.stringify(resData));
}
