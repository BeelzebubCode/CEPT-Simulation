import prisma from '../../src/lib/prisma';

async function main() {
  // Shift sections at order >= 3 up by 1
  const toShift = await prisma.section.findMany({ where: { order: { gte: 3 } }, orderBy: { order: 'desc' } });
  for (const s of toShift) {
    await prisma.section.update({ where: { id: s.id }, data: { order: s.order + 1 } });
  }

  // Create LISTENING_LONG section at order 3
  const created = await prisma.section.create({
    data: {
      name: 'Listening Long',
      description: 'Listen to a recording and answer questions.',
      type: 'LISTENING_LONG',
      order: 3,
      timeLimit: 10,
    },
  });

  console.log('Created:', created.id, created.name, 'order:', created.order);

  // Verify all orders
  const all = await prisma.section.findMany({ orderBy: { order: 'asc' }, select: { order: true, name: true, type: true } });
  all.forEach(s => console.log(s.order, s.type, s.name));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
