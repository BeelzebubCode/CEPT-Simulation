import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/exam — Practice mode data
 *
 * Returns all sections with questions & choices (including isCorrect)
 * because Practice Mode is designed to give instant feedback.
 *
 * Exam Mode uses /api/adaptive which strips isCorrect via safeQuestion().
 *
 * No CDN caching — admin can update questions/images at any time and
 * changes must be visible immediately. DB indexes keep queries fast.
 */
export async function GET(req: Request) {
  try {
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
      return NextResponse.json(sections);
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

    return NextResponse.json(section);
  } catch (error: any) {
    console.error('Error in /api/exam:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500 });
  }
}

