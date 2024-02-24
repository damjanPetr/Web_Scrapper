import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";
import { NextRequest } from "next/server";
import { actionsType } from "../add/page";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { link, title, selector, selectorName, selectorType } = body.options;
  const actions = body.actions;

  console.log("🚀 ✔ POST ✔ actions:", body);

  const test = new Invoker();

  test.setOnStart(new loadBrowserAction());
  test.setOnEnd(new closeBrowserAction());
  test.addAction("openNewPage", link);

  actions.forEach((action: actionsType) => {
    if (action.actionName == "addExtractType" && action.params !== null) {
      console.log(action.params);
      test.addAction(
        "addExtractType",
        action?.params.selector,
        action?.params.name,
        action?.params.type,
      );
    }
  });

  test.addAction("addTitle", title);
  test.addAction("page$$", selector, selectorType, selectorName);
  test.addAction("evaluateElements");
  // test.addAction("printResult");
  await test.activate();

  console.log(test.state.result);
  const resData = {
    result: test.state.result,
  };

  // test.addToDatabase();
  return new Response(JSON.stringify(resData));
}