import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { link, title, selector, selectorName } = await request.json();

  const test = new Invoker();

  test.setOnStart(new loadBrowserAction());
  test.setOnEnd(new closeBrowserAction());
  test.addAction("addTitle", title);
  test.addAction("openNewPage", link);

  test.addAction("addExtractType", "", selectorName, "href");
  test.addAction("addTitle", "test1");

  test.addAction("page$$", selector);
  test.addAction("evaluateElements");
  test.addAction("printResult");
  await test.activate();

  console.log(test.state.result);
  const resData = {
    title: link,
    link: title,
    result: test.state.result,
  };

  // test.addToDatabase();
  return new Response(JSON.stringify(resData));
}
