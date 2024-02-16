/*
  Warnings:

  - You are about to drop the column `content` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `selectors` on the `Action` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" INTEGER NOT NULL,
    CONSTRAINT "Parameter_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Action" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "Action";
DROP TABLE "Action";
ALTER TABLE "new_Action" RENAME TO "Action";
CREATE UNIQUE INDEX "Action_title_key" ON "Action"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_key_key" ON "Parameter"("key");
