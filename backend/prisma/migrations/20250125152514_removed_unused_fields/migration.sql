/*
  Warnings:

  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConversationThread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_threadId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationThread" DROP CONSTRAINT "ConversationThread_documentId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationThread" DROP CONSTRAINT "ConversationThread_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuizOption" DROP CONSTRAINT "QuizOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizId_fkey";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ConversationThread";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "QuizOption";

-- DropTable
DROP TABLE "QuizQuestion";

-- DropEnum
DROP TYPE "DocumentComplexity";

-- DropEnum
DROP TYPE "MessageRole";

-- DropEnum
DROP TYPE "MessageSentiment";

-- DropEnum
DROP TYPE "MessageType";

-- DropEnum
DROP TYPE "QuestionDifficulty";

-- DropEnum
DROP TYPE "QuizDifficulty";

-- DropEnum
DROP TYPE "QuizType";

-- DropEnum
DROP TYPE "ThreadStatus";
