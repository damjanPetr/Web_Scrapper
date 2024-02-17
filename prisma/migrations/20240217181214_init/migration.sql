-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "scrap_InstanceId" INTEGER NOT NULL,
    CONSTRAINT "Action_scrap_InstanceId_fkey" FOREIGN KEY ("scrap_InstanceId") REFERENCES "Scrap_Instance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Action" ("action", "createdAt", "id", "scrap_InstanceId") SELECT "action", "createdAt", "id", "scrap_InstanceId" FROM "Action";
DROP TABLE "Action";
ALTER TABLE "new_Action" RENAME TO "Action";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
