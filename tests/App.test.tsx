import puppeteer from "puppeteer";

import {
  beforeEach,
  afterEach,
  it,
  expect,
  describe,
  vi,
  beforeAll,
  afterAll,
} from "vitest";

const browser = await puppeteer.launch({
  headless: "new",
});

const page = await browser.newPage();
beforeAll(async () => {
  await page.goto("http://localhost:3000");
});

describe("check if the homepage is loading properly", () => {
  it("check if the homepage is loading properly", () => {
    page.$("#search").then((input) => {
      expect(input).toBeDefined();
    });
  });
});

afterAll(async () => {
  browser.close();
});
