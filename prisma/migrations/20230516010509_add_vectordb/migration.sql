-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "data" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "title" TEXT,
    "link" TEXT,
    "embedding" vector(1536),

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);
