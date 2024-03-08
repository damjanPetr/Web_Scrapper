-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scrap_Instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultsPath" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Scrap_Instance" ("createdAt", "id", "title", "url") SELECT "createdAt", "id", "title", "url" FROM "Scrap_Instance";
DROP TABLE "Scrap_Instance";
ALTER TABLE "new_Scrap_Instance" RENAME TO "Scrap_Instance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
