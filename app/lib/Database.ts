import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";

class Database {
  private static prisma: PrismaClient;
  public static getInstance() {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
    return this.prisma;
  }

  private constructor() {}

  async connect() {
    await Database.prisma.$connect();
  }

  async disconnect() {
    await Database.prisma.$disconnect();
  }

  // Add methods for database operations using this.prisma
}

class TextNode {
  private url: string;
  private selectors: string[];
  private data: string[];

  constructor(url: string, selectors: string[]) {
    this.data = [];
    this.url = url;
    this.selectors = selectors;
  }

  async saveText(s: string) {
    const prisma = Database.getInstance();
    const text = await prisma.node.create({
      data: {
        title: s,
        content: s,
        selectors: this.selectors.join(", "), // Updated to use the instance variable
      },
    });
  }

  async scrap() {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(this.url); // Added `await` for the promise
    // Implementation for scraping using selectors goes here
    await page.waitForSelector(`${this.selectors}`).then((element) => {
      element?.evaluate((element) => {
        const text = element.textContent;
        // if (text) this.saveText(text);
        return text;
      });
    });
  }
}

export { TextNode };
