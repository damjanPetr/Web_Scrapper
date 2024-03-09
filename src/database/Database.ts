import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";

const prisma = new PrismaClient();
const db = prisma || new PrismaClient();

export default db;
