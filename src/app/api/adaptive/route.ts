import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function safeQuestion(q: { choices: { id: string; label: string; text: string; imageUrl: string | null; isCorrect: boolean; order: number; blankNumber: number; questionId: string }[]; [key: string]: unknown }) {
  const safeChoices = q.choices.map(c => ({
    id: c.id, label: c.label, text: c.text, imageUrl: c.imageUrl, blankNumber: c.blankNumber
  }));
  return { ...q, choices: safeChoices };
}

async function pickQuestion(sectionId: string, excludeIds: string[], preferDifficulty: string) {
  let q = await prisma.question.findFirst({
    where: { sectionId, id: { notIn: excludeIds }, difficulty: preferDifficulty as 'EASY' | 'MEDIUM' | 'HARD' },
    include: { choices: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });
  if (!q) {
    q = await prisma.question.findFirst({
      where: { sectionId, id: { notIn: excludeIds } },
      include: { choices: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }
  return q;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, attemptId, questionId, choiceId, answeredIds = [], currentSectionId, sectionQCount = 0 } = body;
    const MAX_PER_SECTION = 10;

    // ─── START ───────────────────────────────────────────────────────────────
    if (action === 'start') {
      const attempt = await prisma.examAttempt.create({ data: { mode: 'exam', ceptScore: 0 } });

      const firstSection = await prisma.section.findFirst({
        orderBy: { order: 'asc' },
        include: { questions: { where: { difficulty: 'MEDIUM' }, include: { choices: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' }, take: 1 } },
      });

      if (!firstSection || firstSection.questions.length === 0) {
        return NextResponse.json({ error: 'No questions found' }, { status: 404 });
      }

      const firstQ = firstSection.questions[0];
      return NextResponse.json({
        attemptId: attempt.id,
        theta: 0,
        nextQuestion: safeQuestion(firstQ),
        currentSectionId: firstSection.id,
        currentSectionName: firstSection.name,
        currentSectionType: firstSection.type,
      });
    }

    // ─── ANSWER & GET NEXT ────────────────────────────────────────────────────
    if (action === 'answer') {
      if (!attemptId || !questionId || !choiceId || !currentSectionId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      // blankChoiceIds: for fill-blank questions, all blank answers in order
      // If not provided, treat as a single-answer question
      const blankChoiceIds: string[] = Array.isArray(body.blankChoiceIds) ? body.blankChoiceIds : [choiceId];

      // Save one Answer record per blank choice
      const choices = await prisma.choice.findMany({ where: { id: { in: blankChoiceIds } } });
      const choiceMap = new Map(choices.map(c => [c.id, c]));

      await prisma.answer.createMany({
        data: blankChoiceIds.map(cid => ({
          attemptId,
          questionId,
          choiceId: cid,
          isCorrect: choiceMap.get(cid)?.isCorrect ?? false,
        })),
      });

      // Theta update based on first (or only) choice correctness
      const firstCorrect = choiceMap.get(choiceId)?.isCorrect ?? false;
      const currentTheta = parseFloat(body.theta ?? 0);
      const newTheta = firstCorrect ? currentTheta + 0.5 : currentTheta - 0.3;

      let difficulty = 'MEDIUM';
      if (newTheta >= 1.5) difficulty = 'HARD';
      else if (newTheta <= -0.5) difficulty = 'EASY';

      // Stay in same section if under limit
      if (sectionQCount < MAX_PER_SECTION) {
        const nextQ = await pickQuestion(currentSectionId, answeredIds, difficulty);
        if (nextQ) {
          const section = await prisma.section.findUnique({ where: { id: currentSectionId } });
          return NextResponse.json({
            nextQuestion: safeQuestion(nextQ),
            currentSectionId,
            currentSectionName: section?.name,
            currentSectionType: section?.type,
            sectionChanged: false,
          });
        }
      }

      // Move to next section
      const currentSection = await prisma.section.findUnique({ where: { id: currentSectionId } });
      const nextSection = await prisma.section.findFirst({
        where: { order: { gt: currentSection?.order ?? 0 } },
        orderBy: { order: 'asc' },
      });

      if (nextSection) {
        const firstInNext = await pickQuestion(nextSection.id, answeredIds, 'MEDIUM');
        if (firstInNext) {
          return NextResponse.json({
            nextQuestion: safeQuestion(firstInNext),
            currentSectionId: nextSection.id,
            currentSectionName: nextSection.name,
            currentSectionType: nextSection.type,
            sectionChanged: true,
          });
        }
      }

      // No more sections → exam done
      return NextResponse.json({ nextQuestion: null });
    }

    // ─── FINISH ───────────────────────────────────────────────────────────────
    if (action === 'finish') {
      const answers = await prisma.answer.findMany({ where: { attemptId } });

      // Count unique questions answered (fill-blank has multiple Answer rows per question)
      const uniqueQuestions = new Set(answers.map(a => a.questionId));

      if (uniqueQuestions.size < 10) {
        return NextResponse.json(
          { error: 'ต้องตอบอย่างน้อย 10 ข้อก่อนส่งข้อสอบ' },
          { status: 400 },
        );
      }

      // Score: 1 point per question
      // Fill-blank: partial credit — correct_blanks / total_blanks (sums to 1)
      let totalScore = 0;
      for (const qId of uniqueQuestions) {
        const qAnswers = answers.filter(a => a.questionId === qId);
        if (qAnswers.length === 1) {
          totalScore += qAnswers[0].isCorrect ? 1 : 0;
        } else {
          // Fill-blank partial credit: each blank = 1/N
          const correct = qAnswers.filter(a => a.isCorrect).length;
          totalScore += correct / qAnswers.length;
        }
      }

      const score = Math.min(50, Math.round(totalScore));
      const correctCount = answers.filter(a => a.isCorrect).length;
      const totalItems = uniqueQuestions.size;

      // CEFR mapping (out of 50)
      let cefr = 'Below A1';
      if (score >= 45) cefr = 'C2';
      else if (score >= 38) cefr = 'C1';
      else if (score >= 30) cefr = 'B2';
      else if (score >= 22) cefr = 'B1';
      else if (score >= 14) cefr = 'A2';
      else if (score >= 7)  cefr = 'A1';

      await prisma.examAttempt.update({
        where: { id: attemptId },
        data: { completedAt: new Date(), totalScore: correctCount, totalItems, ceptScore: score, cefrLevel: cefr },
      });

      return NextResponse.json({ score, cefr, totalItems, correctCount });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}