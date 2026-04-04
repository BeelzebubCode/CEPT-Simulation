import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { choices, ...questionData } = body;
  const question = await prisma.question.create({
    data: {
      ...questionData,
      choices: choices ? { create: choices } : undefined,
    },
    include: { choices: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(question, { status: 201 });
}
