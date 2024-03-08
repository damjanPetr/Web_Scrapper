/*
  Warnings:

  - Added the required column `body` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scrap_InstanceId" INTEGER,
    "body" TEXT NOT NULL,
    CONSTRAINT "Result_scrap_InstanceId_fkey" FOREIGN KEY ("scrap_InstanceId") REFERENCES "Scrap_Instance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("id", "scrap_InstanceId") SELECT "id", "scrap_InstanceId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
