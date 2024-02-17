import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";

const db = new PrismaClient();
export default db;
