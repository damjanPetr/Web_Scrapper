import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const db = prisma || new PrismaClient();

// const db = new PrismaClient();

export default db;
