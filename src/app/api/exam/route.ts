import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { order: 'asc' },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { choices: { orderBy: { order: 'asc' } } },
      },
    },
  });
  return NextResponse.json(sections);
}
