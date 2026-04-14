// @ts-nocheck — standalone seed script, not part of Next.js app
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { listening1Questions } from './data/listening1';
import { listening2Questions } from './data/listening2';
import { readingSignsQuestions } from './data/readingSigns';
import { readingFillQuestions } from './data/readingFill';
import { readingCompPassages } from './data/readingComp';

const prisma = new PrismaClient();

async function main() {
  await prisma.answer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.section.deleteMany();
  console.log('Cleared existing data.');

  // ====== SECTION 1: LISTENING PART 1 ======
  const listening1 = await prisma.section.create({
    data: { name: 'Listening Part 1', description: 'Short Conversations & Announcements — Multiple choice from text', type: 'LISTENING_TEXT', timeLimit: 20, order: 1 },
  });
  for (let i = 0; i < listening1Questions.length; i++) {
    const q = listening1Questions[i];
    await prisma.question.create({
      data: {
        sectionId: listening1.id, text: q.text, speechText: q.speechText, difficulty: q.difficulty, order: i + 1,
        choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
      },
    });
  }
  console.log(`Seeded ${listening1Questions.length} questions for Listening Part 1`);

  // ====== SECTION 2: LISTENING PART 2 ======
  const listening2 = await prisma.section.create({
    data: { name: 'Listening Part 2', description: 'Picture-based questions — Select the correct answer', type: 'LISTENING_IMAGE', timeLimit: 10, order: 2 },
  });
  for (let i = 0; i < listening2Questions.length; i++) {
    const q = listening2Questions[i];
    await prisma.question.create({
      data: {
        sectionId: listening2.id, text: q.text, speechText: q.speechText, difficulty: q.difficulty, order: i + 1,
        choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
      },
    });
  }
  console.log(`Seeded ${listening2Questions.length} questions for Listening Part 2`);

  // ====== SECTION 3: READING SIGNS ======
  const readingSigns = await prisma.section.create({
    data: { name: 'Reading: Signs & Notices', description: 'Match signs and short messages with their correct meaning', type: 'READING_SIGNS', timeLimit: 10, order: 3 },
  });
  for (let i = 0; i < readingSignsQuestions.length; i++) {
    const q = readingSignsQuestions[i];
    await prisma.question.create({
      data: {
        sectionId: readingSigns.id, text: q.text, passage: q.passage, difficulty: q.difficulty, order: i + 1,
        choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
      },
    });
  }
  console.log(`Seeded ${readingSignsQuestions.length} questions for Reading Signs`);

  // ====== SECTION 4: READING FILL IN THE BLANK ======
  const readingFill = await prisma.section.create({
    data: { name: 'Reading: Fill in the Blank', description: 'Choose the correct word to complete the sentence or passage', type: 'READING_FILL_BLANK', timeLimit: 15, order: 4 },
  });
  for (let i = 0; i < readingFillQuestions.length; i++) {
    const q = readingFillQuestions[i];
    const allChoices: { label: string; text: string; isCorrect: boolean; order: number; blankNumber: number }[] = [];
    let choiceOrder = 1;
    for (const blank of q.blanks) {
      for (const c of blank.choices) {
        allChoices.push({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: choiceOrder++, blankNumber: blank.blankNumber });
      }
    }
    await prisma.question.create({
      data: {
        sectionId: readingFill.id, text: q.text, passage: q.passage, difficulty: q.difficulty, order: i + 1,
        choices: { create: allChoices },
      },
    });
  }
  console.log(`Seeded ${readingFillQuestions.length} passages for Reading Fill in the Blank`);

  // ====== SECTION 5: READING COMPREHENSION ======
  const readingComp = await prisma.section.create({
    data: { name: 'Reading Comprehension', description: 'Read the passage and answer the questions', type: 'READING_COMPREHENSION', timeLimit: 20, order: 5 },
  });
  let compOrder = 1;
  for (const p of readingCompPassages) {
    for (const q of p.questions) {
      await prisma.question.create({
        data: {
          sectionId: readingComp.id, text: q.text, passage: p.passage, difficulty: p.difficulty, order: compOrder++,
          choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
        },
      });
    }
  }
  console.log(`Seeded ${compOrder - 1} questions for Reading Comprehension`);

  const total = listening1Questions.length + listening2Questions.length + readingSignsQuestions.length + readingFillQuestions.length + (compOrder - 1);
  console.log(`\n✅ Seed complete! Total: ${total} questions`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
