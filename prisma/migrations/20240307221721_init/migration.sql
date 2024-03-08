-- CreateTable
CREATE TABLE "Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scrap_InstanceId" INTEGER,
    CONSTRAINT "Result_scrap_InstanceId_fkey" FOREIGN KEY ("scrap_InstanceId") REFERENCES "Scrap_Instance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
