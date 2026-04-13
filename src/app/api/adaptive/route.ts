import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function safeQuestion(q: { choices: { id: string; label: string; text: string; imageUrl: string | null; isCorrect: boolean; order: number; blankNumber: number; questionId: string }[]; [key: string]: unknown }) {
  const safeChoices = q.choices.map(c => ({
    id: c.id, label: c.label, text: c.text, imageUrl: c.imageUrl, blankNumber: c.blankNumber
  }));
  return { ...q, choices: safeChoices };
}

// Single DB round-trip: fetch candidates and prefer difficulty at app level
async function pickQuestion(sectionId: string, excludeIds: string[], preferDifficulty: string) {
  const candidates = await prisma.question.findMany({
    where: { sectionId, id: { notIn: excludeIds } },
    include: { choices: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
    take: 10,
  });
  return candidates.find(q => q.difficulty === preferDifficulty) ?? candidates[0] ?? null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, attemptId, questionId, choiceId, answeredIds = [], currentSectionId, sectionQCount = 0 } = body;
    const MAX_PER_SECTION = 10;

    // ─── START ───────────────────────────────────────────────────────────────
    if (action === 'start') {
      const [attempt, firstSection] = await Promise.all([
        prisma.examAttempt.create({ data: { mode: 'exam', ceptScore: 0 } }),
        prisma.section.findFirst({
          orderBy: { order: 'asc' },
          include: {
            questions: {
              where: { difficulty: 'MEDIUM' },
              include: { choices: { orderBy: { order: 'asc' } } },
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        }),
      ]);

      if (!firstSection || firstSection.questions.length === 0) {
        return NextResponse.json({ error: 'No questions found' }, { status: 404 });
      }

      return NextResponse.json({
        attemptId: attempt.id,
        theta: 0,
        nextQuestion: safeQuestion(firstSection.questions[0]),
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

      const blankChoiceIds: string[] = Array.isArray(body.blankChoiceIds) ? body.blankChoiceIds : [choiceId];

      // Batch 1 — parallel: fetch choices + section info
      const [choices, currentSection] = await Promise.all([
        prisma.choice.findMany({ where: { id: { in: blankChoiceIds } } }),
        prisma.section.findUnique({ where: { id: currentSectionId } }),
      ]);

      const choiceMap = new Map(choices.map(c => [c.id, c]));
      const firstCorrect = choiceMap.get(choiceId)?.isCorrect ?? false;
      const newTheta = firstCorrect
        ? parseFloat(body.theta ?? 0) + 0.5
        : parseFloat(body.theta ?? 0) - 0.3;

      const difficulty = newTheta >= 1.5 ? 'HARD' : newTheta <= -0.5 ? 'EASY' : 'MEDIUM';

      const answerData = blankChoiceIds.map(cid => ({
        attemptId, questionId, choiceId: cid,
        isCorrect: choiceMap.get(cid)?.isCorrect ?? false,
      }));

      // Save answers exactly once — reuse the same Promise in both branches
      const savePromise = prisma.answer.createMany({ data: answerData });

      if (sectionQCount < MAX_PER_SECTION) {
        // Batch 2 — parallel: save + pick next in same section
        const [, nextQ] = await Promise.all([
          savePromise,
          pickQuestion(currentSectionId, answeredIds, difficulty),
        ]);

        if (nextQ) {
          return NextResponse.json({
            nextQuestion: safeQuestion(nextQ),
            theta: newTheta,         // ← always return updated theta
            currentSectionId,
            currentSectionName: currentSection?.name,
            currentSectionType: currentSection?.type,
            sectionChanged: false,
          });
        }

        // No more questions in this section — find next section
        // savePromise already resolved above, this await is instant
        const nextSection = await prisma.section.findFirst({
          where: { order: { gt: currentSection?.order ?? 0 } },
          orderBy: { order: 'asc' },
        });

        if (nextSection) {
          const firstInNext = await pickQuestion(nextSection.id, answeredIds, 'MEDIUM');
          if (firstInNext) {
            return NextResponse.json({
              nextQuestion: safeQuestion(firstInNext),
              theta: newTheta,
              currentSectionId: nextSection.id,
              currentSectionName: nextSection.name,
              currentSectionType: nextSection.type,
              sectionChanged: true,
            });
          }
        }
      } else {
        // Section limit reached — parallel: save + find next section
        const [, nextSection] = await Promise.all([
          savePromise,
          prisma.section.findFirst({
            where: { order: { gt: currentSection?.order ?? 0 } },
            orderBy: { order: 'asc' },
          }),
        ]);

        if (nextSection) {
          const firstInNext = await pickQuestion(nextSection.id, answeredIds, 'MEDIUM');
          if (firstInNext) {
            return NextResponse.json({
              nextQuestion: safeQuestion(firstInNext),
              theta: newTheta,
              currentSectionId: nextSection.id,
              currentSectionName: nextSection.name,
              currentSectionType: nextSection.type,
              sectionChanged: true,
            });
          }
        }
      }

      return NextResponse.json({ nextQuestion: null });
    }

    // ─── FINISH ───────────────────────────────────────────────────────────────
    if (action === 'finish') {
      const answers = await prisma.answer.findMany({ where: { attemptId } });
      const uniqueQuestions = new Set(answers.map(a => a.questionId));

      if (uniqueQuestions.size < 10) {
        return NextResponse.json(
          { error: 'ต้องตอบอย่างน้อย 10 ข้อก่อนส่งข้อสอบ' },
          { status: 400 },
        );
      }

      let totalScore = 0;
      for (const qId of uniqueQuestions) {
        const qAnswers = answers.filter(a => a.questionId === qId);
        if (qAnswers.length === 1) {
          totalScore += qAnswers[0].isCorrect ? 1 : 0;
        } else {
          // Fill-blank partial credit: correct_blanks / total_blanks
          totalScore += qAnswers.filter(a => a.isCorrect).length / qAnswers.length;
        }
      }

      const score = Math.min(50, Math.round(totalScore));
      const correctCount = answers.filter(a => a.isCorrect).length;
      const totalItems = uniqueQuestions.size;

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
