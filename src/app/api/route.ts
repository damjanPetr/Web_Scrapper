import { closeBrowserAction, loadBrowserAction } from "@/src/lib/Action";
import { Invoker } from "@/src/lib/Invoker";

export async function GET(request: Request) {
  const test = new Invoker();

  test.setOnStart(new loadBrowserAction());
  test.setOnEnd(new closeBrowserAction());
  test.addAction("addTitle", "string");
  test.addAction(
    "openNewPage",
    "https://haberdashpi.github.io/vscode-selection-utilities/stable/edit_text.html",
  );

  test.addAction("addExtractType", "", "link", "href");
  test.addAction("addTitle", "test1");
  test.addAction("page$$", "a");
  test.addAction("evaluateElements");
  test.addAction("printResult");
  await test.activate();

  const play = test.state.info.title;
  // test.addToDatabase();
  return "huhuhh";
}
