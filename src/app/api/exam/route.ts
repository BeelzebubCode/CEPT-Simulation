import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cache durations (seconds)
const LIST_CACHE = 'public, s-maxage=300, stale-while-revalidate=600';   // 5 min CDN, 10 min stale
const SECTION_CACHE = 'public, s-maxage=600, stale-while-revalidate=900'; // 10 min CDN, 15 min stale

/**
 * GET /api/exam — Practice mode data
 *
 * Returns all sections with questions & choices (including isCorrect)
 * because Practice Mode is designed to give instant feedback.
 *
 * Exam Mode uses /api/adaptive which strips isCorrect via safeQuestion().
 *
 * To prevent abuse we only return one section at a time based on
 * an optional ?sectionId= query param.  Without it, return section list only.
 *
 * Responses are cached at the Vercel CDN edge to reduce DB load.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get('sectionId');

  // If no sectionId, return lightweight section list (no questions / no answers)
  if (!sectionId) {
    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        timeLimit: true,
        order: true,
        _count: { select: { questions: true } },
      },
    });
    return NextResponse.json(sections, {
      headers: { 'Cache-Control': LIST_CACHE },
    });
  }

  // Return single section with full question data for practice
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { choices: { orderBy: { order: 'asc' } } },
      },
    },
  });

  if (!section) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  return NextResponse.json(section, {
    headers: { 'Cache-Control': SECTION_CACHE },
  });
}

