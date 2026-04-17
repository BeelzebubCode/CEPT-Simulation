import prisma from '../../src/lib/prisma';
import { readingSentenceQuestions } from '../data/readingSentence';
import { readingSentenceQuestions2 } from '../data/readingSentence2';

async function main() {
  const section = await prisma.section.findFirst({ where: { type: 'READING_SENTENCE' } });
  if (!section) throw new Error('READING_SENTENCE section not found');

  console.log(`Found section: ${section.name} (${section.id})`);

  // Delete existing questions + choices for this section only
  const existing = await prisma.question.findMany({
    where: { sectionId: section.id },
    select: { id: true },
  });
  const qIds = existing.map(q => q.id);
  console.log(`Deleting ${qIds.length} existing questions...`);

  await prisma.choice.deleteMany({ where: { questionId: { in: qIds } } });
  await prisma.question.deleteMany({ where: { sectionId: section.id } });

  // Combine both files
  const allQuestions = [...readingSentenceQuestions, ...readingSentenceQuestions2];
  console.log(`Inserting ${allQuestions.length} questions...`);

  for (let i = 0; i < allQuestions.length; i++) {
    const q = allQuestions[i];
    await prisma.question.create({
      data: {
        sectionId: section.id,
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

  console.log(`Done. Inserted ${allQuestions.length} questions.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
