import { afterAll, beforeAll, describe, expect, test } from "vitest";
import puppeteer, { Browser, Page } from "puppeteer";

describe("add page should produce result", async () => {
  let browser: Browser;
  let page: Page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    browser.close();
  });

  test("json web site", async () => {
    await page.goto("http://localhost:3000/add", {
      waitUntil: "load",
    });

    const link = await page.waitForSelector('input[name="link"]');
    const title = await page.waitForSelector('input[name="title"]');

    const selectorName = await page.waitForSelector(
      'input[name="selectorName"]',
    );
    const selector = await page.waitForSelector('input[name="page$$"]');

    const formBtn = await page.waitForSelector('form button[type="submit"]');

    await title?.type("test");
    await link?.type("https://jsonplaceholder.typicode.com/");

    await selectorName?.type("test1");
    await selector?.type("a");

    await formBtn?.click();
    const result = await page.waitForSelector("#results");
    await page.waitForSelector("#results > div");

    console.log(await result?.evaluate((e: any) => e.dataset["res"]));
    /* to have a result */
    const data = await result?.evaluate((e: any) => {
      return e.dataset["res"];
    });
    expect(data).toBe("true");

    await page.screenshot({
      path: "./testData/screenshot.png",
      fullPage: true,
    });
  });
});
