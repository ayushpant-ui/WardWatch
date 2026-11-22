import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'ayushpant@2073.gov.np' },
    update: {
      password:adminPassword,
      role: 'municipal_admin',
      status: 'active',
    },
    create: {
      name: 'Municipal Administrator',
      email: 'ayushpant@2073.gov.np',
      password:adminPassword,
      role: 'municipal_admin',
      status: 'active',
      municipality: 'Kathmandu Metropolitan City',
      designation: 'Chief Municipal Admin',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });