import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { readingSentenceQuestions } from './data/readingSentence';

const prisma = new PrismaClient();

async function main() {
  // Check if section already exists
  const existing = await prisma.section.findFirst({
    where: { type: 'READING_SENTENCE' },
  });

  if (existing) {
    console.log(`⚠️  Reading Sentence Fill section already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  // Create ONLY the new section — no deleting existing data
  const readingSentence = await prisma.section.create({
    data: {
      name: 'Reading: Sentence Fill',
      description: 'Click on the gap then choose the word or phrase which best completes the sentence.',
      type: 'READING_SENTENCE',
      timeLimit: 15,
      order: 4,
    },
  });

  for (let i = 0; i < readingSentenceQuestions.length; i++) {
    const q = readingSentenceQuestions[i];
    await prisma.question.create({
      data: {
        sectionId: readingSentence.id,
        text: q.text,
        difficulty: q.difficulty,
        order: i + 1,
        choices: {
          create: q.choices.map((c, ci) => ({
            label: c.label,
            text: c.text,
            isCorrect: c.isCorrect,
            order: ci + 1,
          })),
        },
      },
    });
  }

  console.log(`✅ Seeded ${readingSentenceQuestions.length} questions for Reading: Sentence Fill`);

  // Fix order of sections that come after (if needed)
  const sectionsAfter = await prisma.section.findMany({
    where: {
      order: { gte: 4 },
      id: { not: readingSentence.id },
    },
    orderBy: { order: 'asc' },
  });

  let nextOrder = 5;
  for (const s of sectionsAfter) {
    if (s.order < nextOrder) {
      await prisma.section.update({
        where: { id: s.id },
        data: { order: nextOrder },
      });
      console.log(`  ↳ Bumped "${s.name}" order to ${nextOrder}`);
    }
    nextOrder = Math.max(nextOrder, s.order) + 1;
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
