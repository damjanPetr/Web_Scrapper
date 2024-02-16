/*
  Warnings:

  - You are about to drop the column `scrap_actionsId` on the `Action` table. All the data in the column will be lost.
  - Added the required column `actionId` to the `scrap_actions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scrap_actions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scrap_InstanceId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    CONSTRAINT "scrap_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scrap_actions_scrap_InstanceId_fkey" FOREIGN KEY ("scrap_InstanceId") REFERENCES "Scrap_Instance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scrap_actions" ("createdAt", "id", "scrap_InstanceId") SELECT "createdAt", "id", "scrap_InstanceId" FROM "scrap_actions";
DROP TABLE "scrap_actions";
ALTER TABLE "new_scrap_actions" RENAME TO "scrap_actions";
CREATE TABLE "new_Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" INTEGER NOT NULL,
    "scrap_actionsId" INTEGER,
    CONSTRAINT "Parameter_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parameter_scrap_actionsId_fkey" FOREIGN KEY ("scrap_actionsId") REFERENCES "scrap_actions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Parameter" ("actionId", "id", "key", "value") SELECT "actionId", "id", "key", "value" FROM "Parameter";
DROP TABLE "Parameter";
ALTER TABLE "new_Parameter" RENAME TO "Parameter";
CREATE UNIQUE INDEX "Parameter_key_key" ON "Parameter"("key");
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
