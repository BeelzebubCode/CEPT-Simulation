-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "cefrLevel" TEXT,
ADD COLUMN     "ceptScore" DOUBLE PRECISION,
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'exam';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM';
