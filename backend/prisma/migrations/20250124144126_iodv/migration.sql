/*
  Warnings:

  - You are about to drop the column `complexity` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `embeddings` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pineconeVectorDataId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalName` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicUrl` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `parsedText` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "complexity",
DROP COLUMN "embeddings",
DROP COLUMN "field",
DROP COLUMN "fileUrl",
DROP COLUMN "language",
DROP COLUMN "tags",
DROP COLUMN "title",
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "pineconeVectorDataId" TEXT,
ADD COLUMN     "publicUrl" TEXT NOT NULL,
ALTER COLUMN "parsedText" SET NOT NULL;

-- CreateTable
CREATE TABLE "PineconeVectorData" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "totalVectors" INTEGER NOT NULL,

    CONSTRAINT "PineconeVectorData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_pineconeVectorDataId_key" ON "Document"("pineconeVectorDataId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_pineconeVectorDataId_fkey" FOREIGN KEY ("pineconeVectorDataId") REFERENCES "PineconeVectorData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
