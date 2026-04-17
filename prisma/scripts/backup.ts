import prisma from '../../src/lib/prisma';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const [sections, questions, choices, attempts, answers] = await Promise.all([
    prisma.section.findMany({ orderBy: { order: 'asc' } }),
    prisma.question.findMany({ orderBy: [{ sectionId: 'asc' }, { order: 'asc' }] }),
    prisma.choice.findMany({ orderBy: [{ questionId: 'asc' }, { order: 'asc' }] }),
    prisma.examAttempt.findMany({ orderBy: { startedAt: 'asc' } }),
    prisma.answer.findMany(),
  ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    counts: { sections: sections.length, questions: questions.length, choices: choices.length, attempts: attempts.length, answers: answers.length },
    sections,
    questions,
    choices,
    attempts,
    answers,
  };

  const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
  const outPath = join(process.cwd(), 'backups', filename);
  writeFileSync(outPath, JSON.stringify(backup, null, 2));

  console.log(`✓ Backup saved: backups/${filename}`);
  console.log(`  sections: ${sections.length}, questions: ${questions.length}, choices: ${choices.length}`);
  console.log(`  attempts: ${attempts.length}, answers: ${answers.length}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
