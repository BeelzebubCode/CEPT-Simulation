import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { choices, ...questionData } = body;

  // Update question fields
  await prisma.question.update({ where: { id }, data: questionData });

  // If choices provided, delete old and create new
  if (choices) {
    await prisma.choice.deleteMany({ where: { questionId: id } });
    await prisma.choice.createMany({
      data: choices.map((c: { label: string; text: string; isCorrect: boolean; imageUrl?: string; order: number; blankNumber?: number }) => ({
        ...c,
        questionId: id,
      })),
    });
  }

  const updated = await prisma.question.findUnique({
    where: { id },
    include: { choices: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
