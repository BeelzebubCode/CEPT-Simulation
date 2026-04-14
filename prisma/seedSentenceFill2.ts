// @ts-nocheck — standalone seed script, not part of Next.js app
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { readingSentenceQuestions2 } from './data/readingSentence2';

const prisma = new PrismaClient();

async function main() {
  // Find existing READING_SENTENCE section
  const section = await prisma.section.findFirst({
    where: { type: 'READING_SENTENCE' },
  });

  if (!section) {
    console.error('❌ READING_SENTENCE section not found! Run seedSentenceFill.ts first.');
    process.exit(1);
  }

  // Get current max order in the section
  const lastQuestion = await prisma.question.findFirst({
    where: { sectionId: section.id },
    orderBy: { order: 'desc' },
  });

  const startOrder = (lastQuestion?.order ?? 0) + 1;
  console.log(`📌 Found section "${section.name}" (id: ${section.id})`);
  console.log(`   Starting from order: ${startOrder}`);

  let added = 0;
  for (let i = 0; i < readingSentenceQuestions2.length; i++) {
    const q = readingSentenceQuestions2[i];
    await prisma.question.create({
      data: {
        sectionId: section.id,
        text: q.text,
        difficulty: q.difficulty,
        order: startOrder + i,
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
    added++;
  }

  console.log(`✅ Added ${added} questions (Q${startOrder}–Q${startOrder + added - 1}) to "${section.name}"`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
