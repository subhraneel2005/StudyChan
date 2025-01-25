/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_documentId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Document_fileName_key" ON "Document"("fileName");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("fileName") ON DELETE SET NULL ON UPDATE CASCADE;
