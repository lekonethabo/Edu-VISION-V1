import { prisma } from './lib/db';

async function main() {
  const users = await prisma.user.findMany({ select: { regID: true, role: true, schoolId: true } });
  const schools = await prisma.school.findMany({ select: { id: true, name: true, toolType: true, createdById: true } });
  console.log('USERS', JSON.stringify(users, null, 2));
  console.log('SCHOOLS', JSON.stringify(schools, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
