import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { questions: true } } },
  });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const body = await req.json();
  const section = await prisma.section.create({ data: body });
  return NextResponse.json(section, { status: 201 });
}
