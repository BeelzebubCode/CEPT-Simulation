import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

function parseUpdateBody(body: unknown): {
  name?: string; description?: string; timeLimit?: number; order?: number;
} | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  if (b.name !== undefined) {
    if (typeof b.name !== 'string' || b.name.trim() === '') return null;
    out.name = b.name.trim();
  }
  if (b.description !== undefined) {
    if (typeof b.description !== 'string') return null;
    out.description = b.description.trim();
  }
  if (b.timeLimit !== undefined) {
    if (typeof b.timeLimit !== 'number' || !Number.isInteger(b.timeLimit) || b.timeLimit < 1 || b.timeLimit > 300) return null;
    out.timeLimit = b.timeLimit;
  }
  if (b.order !== undefined) {
    if (typeof b.order !== 'number' || !Number.isInteger(b.order) || b.order < 0) return null;
    out.order = b.order;
  }
  return out as { name?: string; description?: string; timeLimit?: number; order?: number };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const section = await prisma.section.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { choices: { orderBy: { order: 'asc' } } },
      },
    },
  });
  if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(section);
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
  const data = parseUpdateBody(body);
  if (!data) return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  const section = await prisma.section.update({ where: { id }, data });
  return NextResponse.json(section);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.section.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}