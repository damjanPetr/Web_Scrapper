-- CreateTable
CREATE TABLE "Scrap_Instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "scrap_actions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scrap_InstanceId" INTEGER NOT NULL,
    CONSTRAINT "scrap_actions_scrap_InstanceId_fkey" FOREIGN KEY ("scrap_InstanceId") REFERENCES "Scrap_Instance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scrap_actionsId" INTEGER,
    CONSTRAINT "Action_scrap_actionsId_fkey" FOREIGN KEY ("scrap_actionsId") REFERENCES "scrap_actions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Action" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "Action";
DROP TABLE "Action";
ALTER TABLE "new_Action" RENAME TO "Action";
CREATE UNIQUE INDEX "Action_title_key" ON "Action"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
