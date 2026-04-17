import prisma from '../../src/lib/prisma';
import { listeningLongGroups } from '../data/listeningLong';

async function main() {
  const section = await prisma.section.findFirst({ where: { type: 'LISTENING_LONG' } });
  if (!section) throw new Error('LISTENING_LONG section not found. Run addListeningLong.ts first.');

  // Delete existing questions in this section
  const existing = await prisma.question.findMany({ where: { sectionId: section.id }, select: { id: true } });
  if (existing.length > 0) {
    await prisma.choice.deleteMany({ where: { questionId: { in: existing.map(q => q.id) } } });
    await prisma.question.deleteMany({ where: { sectionId: section.id } });
    console.log(`Removed ${existing.length} existing questions.`);
  }

  let order = 1;
  for (const grp of listeningLongGroups) {
    for (const q of grp.questions) {
      await prisma.question.create({
        data: {
          sectionId: section.id,
          text: q.text,
          passage: grp.passage,
          speechText: grp.speechText,
          difficulty: q.difficulty,
          order: order++,
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
  }

  const total = listeningLongGroups.reduce((s, g) => s + g.questions.length, 0);
  console.log(`Done. Inserted ${total} questions across ${listeningLongGroups.length} audio groups.`);
  console.log(`Answer keys: Adam=BDACD | Anna=BCBAC | Ben=CACBA`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
