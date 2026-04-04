import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

const VALID_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
type Difficulty = typeof VALID_DIFFICULTIES[number];

interface ChoiceInput {
  label: string; text: string; isCorrect: boolean;
  order: number; imageUrl?: string; blankNumber?: number;
}

function parseChoice(c: unknown): ChoiceInput | null {
  if (typeof c !== 'object' || c === null) return null;
  const b = c as Record<string, unknown>;
  if (typeof b.label !== 'string' || b.label.trim() === '') return null;
  if (typeof b.text !== 'string') return null;
  if (typeof b.isCorrect !== 'boolean') return null;
  if (typeof b.order !== 'number' || !Number.isInteger(b.order)) return null;
  return {
    label: b.label.trim(),
    text: b.text.trim(),
    isCorrect: b.isCorrect,
    order: b.order,
    imageUrl: typeof b.imageUrl === 'string' ? b.imageUrl : undefined,
    blankNumber: typeof b.blankNumber === 'number' ? b.blankNumber : undefined,
  };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  }
  const b = body as Record<string, unknown>;

  // Whitelist updatable fields — no sectionId, id, createdAt etc.
  const questionData: Record<string, unknown> = {};
  if (typeof b.text === 'string') questionData.text = b.text.trim();
  if (typeof b.passage === 'string') questionData.passage = b.passage.trim();
  if (typeof b.speechText === 'string') questionData.speechText = b.speechText.trim();
  if (typeof b.imageUrl === 'string') questionData.imageUrl = b.imageUrl;
  if (typeof b.order === 'number' && Number.isInteger(b.order)) questionData.order = b.order;
  if (VALID_DIFFICULTIES.includes(b.difficulty as Difficulty)) questionData.difficulty = b.difficulty;

  await prisma.question.update({ where: { id }, data: questionData });

  if (Array.isArray(b.choices)) {
    const choices: ChoiceInput[] = [];
    for (const c of b.choices) {
      const parsed = parseChoice(c);
      if (!parsed) return NextResponse.json({ error: 'Invalid choice data' }, { status: 422 });
      choices.push(parsed);
    }
    await prisma.choice.deleteMany({ where: { questionId: id } });
    if (choices.length > 0) {
      await prisma.choice.createMany({
        data: choices.map(c => ({ ...c, questionId: id })),
      });
    }
  }

  const updated = await prisma.question.findUnique({
    where: { id },
    include: { choices: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}