import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

const VALID_TYPES = [
  'LISTENING_TEXT', 'LISTENING_IMAGE', 'READING_SIGNS',
  'READING_FILL_BLANK', 'READING_COMPREHENSION',
] as const;
type SectionType = typeof VALID_TYPES[number];

function parseSectionBody(body: unknown): {
  name: string; description?: string; type: SectionType; timeLimit: number; order: number;
} | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== 'string' || b.name.trim() === '') return null;
  if (!VALID_TYPES.includes(b.type as SectionType)) return null;
  if (typeof b.timeLimit !== 'number' || !Number.isInteger(b.timeLimit) || b.timeLimit < 1 || b.timeLimit > 300) return null;
  if (typeof b.order !== 'number' || !Number.isInteger(b.order) || b.order < 0) return null;
  return {
    name: b.name.trim(),
    description: typeof b.description === 'string' ? b.description.trim() : undefined,
    type: b.type as SectionType,
    timeLimit: b.timeLimit,
    order: b.order,
  };
}

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { questions: true } } },
  });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const data = parseSectionBody(body);
  if (!data) return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  const section = await prisma.section.create({ data });
  return NextResponse.json(section, { status: 201 });
}