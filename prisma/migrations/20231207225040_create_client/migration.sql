-- CreateTable
CREATE TABLE "clients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "altura" REAL NOT NULL,
    "lactose" BOOLEAN NOT NULL,
    "peso" REAL NOT NULL,
    "atleta" BOOLEAN NOT NULL
);
