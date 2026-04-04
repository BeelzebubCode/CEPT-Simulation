import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function safeQuestion(q: { choices: { id: string; label: string; text: string; imageUrl: string | null; isCorrect: boolean; order: number; blankNumber: number; questionId: string }[]; [key: string]: unknown }) {
  const safeChoices = q.choices.map(c => ({
    id: c.id, label: c.label, text: c.text, imageUrl: c.imageUrl, blankNumber: c.blankNumber
  }));
  return { ...q, choices: safeChoices };
}

async function pickQuestion(sectionId: string, excludeIds: string[], preferDifficulty: string) {
  // Try preferred difficulty first, then fallback to any in same section
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

      // Get first section (by order)
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

      // Check correctness & save
      const choice = await prisma.choice.findUnique({ where: { id: choiceId } });
      const isCorrect = choice?.isCorrect ?? false;
      await prisma.answer.create({ data: { attemptId, questionId, choiceId, isCorrect } });

      // Update theta (IRT approximation)
      const currentTheta = parseFloat(body.theta ?? 0);
      const newTheta = isCorrect ? currentTheta + 0.5 : currentTheta - 0.3;

      // Target difficulty based on theta
      let difficulty = 'MEDIUM';
      if (newTheta >= 1.5) difficulty = 'HARD';
      else if (newTheta <= -0.5) difficulty = 'EASY';

      // Try to pick next question from the SAME section (only if under the per-section limit)
      if (sectionQCount < MAX_PER_SECTION) {
        const nextQ = await pickQuestion(currentSectionId, answeredIds, difficulty);
        if (nextQ) {
          const section = await prisma.section.findUnique({ where: { id: currentSectionId } });
          return NextResponse.json({
            isCorrect,
            theta: newTheta,
            nextQuestion: safeQuestion(nextQ),
            currentSectionId,
            currentSectionName: section?.name,
            currentSectionType: section?.type,
            sectionChanged: false,
          });
        }
      }

      // Section hit 10-question limit (or exhausted) — move to next section
      const currentSection = await prisma.section.findUnique({ where: { id: currentSectionId } });
      const nextSection = await prisma.section.findFirst({
        where: { order: { gt: currentSection?.order ?? 0 } },
        orderBy: { order: 'asc' },
      });

      if (nextSection) {
        const firstInNext = await pickQuestion(nextSection.id, answeredIds, 'MEDIUM');
        if (firstInNext) {
          return NextResponse.json({
            isCorrect,
            theta: newTheta,
            nextQuestion: safeQuestion(firstInNext),
            currentSectionId: nextSection.id,
            currentSectionName: nextSection.name,
            currentSectionType: nextSection.type,
            sectionChanged: true,
          });
        }
      }

      // No more sections → exam done
      return NextResponse.json({ isCorrect, theta: newTheta, nextQuestion: null });
    }

    // ─── FINISH ───────────────────────────────────────────────────────────────
    if (action === 'finish') {
      // Fetch answers together with the question's difficulty level
      const answers = await prisma.answer.findMany({
        where: { attemptId },
        include: { question: { select: { difficulty: true } } },
      });

      const totalItems = answers.length;
      const correctCount = answers.filter(a => a.isCorrect).length;

      if (totalItems === 0) {
        return NextResponse.json({ score: 0, cefr: 'Below A1', totalItems: 0, correctCount: 0 });
      }

      // Weighted score: harder correct answers are worth more
      const weights: Record<string, number> = { EASY: 0.8, MEDIUM: 1.0, HARD: 1.4 };
      let earnedWeight = 0;
      let maxWeight = 0;

      for (const a of answers) {
        const w = weights[a.question.difficulty] ?? 1.0;
        maxWeight += w;
        if (a.isCorrect) earnedWeight += w;
      }

      // Scale to 0–50
      const ratio = maxWeight > 0 ? earnedWeight / maxWeight : 0;
      const score = Math.min(50, Math.round(ratio * 50));

      // CEFR mapping (score out of 50)
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
