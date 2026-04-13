-- CreateIndex
CREATE INDEX "Answer_attemptId_idx" ON "Answer"("attemptId");

-- CreateIndex
CREATE INDEX "Question_sectionId_difficulty_order_idx" ON "Question"("sectionId", "difficulty", "order");

-- CreateIndex
CREATE INDEX "Question_sectionId_order_idx" ON "Question"("sectionId", "order");
