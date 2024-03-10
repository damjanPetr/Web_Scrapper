import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";
import { NextRequest, NextResponse } from "next/server";
import { actionsType } from "../add/page";

export async function GET() {
  return new Response("Hello, Next.js!");
}
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { link, title, selector, selectorName, selectorType } = body.options;
  const actions = body.actions;

  let test = new Invoker();

  console.log(title);
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
  test.addAction("printResult");

  let done = false;
  const promise = new Promise(async (resolve, reject) => {
    try {
      await test.activate();
      test.addToDatabase();
      resolve("success");
    } catch (err) {
      if (err instanceof Error) reject(err);
    }
  });

  const res = new Response(
    //   new ReadableStream({
    //     async start(controller) {
    //       const timer = setInterval(() => {
    //         try {
    //           const percent = test.state.progress;

    //           controller.enqueue(percent.toString());
    //           if (done) {
    //             controller.enqueue(JSON.stringify({ result: test.state.result }));
    //             clearInterval(timer);
    //             controller.close();
    //           }
    //           console.log("💢", title);
    //         } catch (e) {
    //           clearInterval(timer);
    //           controller.close();
    //         }
    //       }, 400);
    //       try {
    //         await promise;
    //       } catch (err) {
    //         if (err instanceof Error)
    //           controller.enqueue(JSON.stringify({ error: err.message }));
    //         clearInterval(timer);
    //         controller.close();
    //       }
    //       console.log(test.state.result.at(-1));
    //       done = true;
    //     },
    //   }),
    //   {
    //     status: 200,
    //   },
    JSON.stringify({ result: test.state.result }),
  );
  try {
    await promise;
    return new NextResponse(JSON.stringify({ result: test.state.result }), {
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  }
}
