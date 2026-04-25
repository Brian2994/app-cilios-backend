// test.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Conectando...');
  await prisma.$connect();
  console.log('OK!');
}

main()
  .catch((e) => {
    console.error('Erro:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });