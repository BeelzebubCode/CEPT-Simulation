import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { parseChoice, parseDifficulty, type ChoiceInput } from '@/lib/validators';

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  }
  const b = body as Record<string, unknown>;
  if (typeof b.sectionId !== 'string' || b.sectionId.trim() === '') {
    return NextResponse.json({ error: 'Invalid sectionId' }, { status: 422 });
  }
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    return NextResponse.json({ error: 'Invalid text' }, { status: 422 });
  }
  if (typeof b.order !== 'number' || !Number.isInteger(b.order)) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 422 });
  }
  const difficulty = parseDifficulty(b.difficulty);

  const rawChoices = Array.isArray(b.choices) ? b.choices : [];
  const choices: ChoiceInput[] = [];
  for (const c of rawChoices) {
    const parsed = parseChoice(c);
    if (!parsed) return NextResponse.json({ error: 'Invalid choice data' }, { status: 422 });
    choices.push(parsed);
  }

  const question = await prisma.question.create({
    data: {
      sectionId: b.sectionId.trim(),
      text: b.text.trim(),
      passage: typeof b.passage === 'string' ? b.passage.trim() : undefined,
      speechText: typeof b.speechText === 'string' ? b.speechText.trim() : undefined,
      imageUrl: typeof b.imageUrl === 'string' ? b.imageUrl : undefined,
      difficulty,
      order: b.order,
      choices: choices.length > 0 ? { create: choices } : undefined,
    },
    include: { choices: { orderBy: { order: 'asc' } } },
  });
  revalidatePath('/api/exam');
  return NextResponse.json(question, { status: 201 });
}