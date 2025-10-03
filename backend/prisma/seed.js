require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'bpjskesaceh@gmail.com';
  const name = 'Admin Cabang';
  const rawPassword = 'AdminCabang@2025'; // GANTI setelah pertama kali login!
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({ data: { email: adminEmail, name, passwordHash } });
    console.log('✅ Admin default dibuat:', adminEmail, 'password:', rawPassword);
  } else {
    console.log('ℹ️ Admin sudah ada, skip.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
