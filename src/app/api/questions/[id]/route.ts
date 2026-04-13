import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { parseChoice, parseDifficulty, type ChoiceInput } from '@/lib/validators';

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
  if (b.difficulty !== undefined) questionData.difficulty = parseDifficulty(b.difficulty);

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
  revalidatePath('/api/exam');
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  revalidatePath('/api/exam');
  return NextResponse.json({ ok: true });
}