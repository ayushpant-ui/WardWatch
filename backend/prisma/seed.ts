import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
 const adminPassword = await bcrypt.hash('Admin@12345', 10);

  // 1. Bhimdatta Municipality Admin
  await prisma.user.upsert({
    where: { email: 'ayushpant@2074.gov.np' },
    update: {
      password: adminPassword,
      role: 'municipal_admin',
      status: 'active',
      municipality: 'Bhimdatta Municipality',
      province: 'Sudurpashchim',
      district: 'Kanchanpur',
    },
    create: {
      name: 'Bhimdatta Municipal Administrator',
      email: 'ayushpant@2074.gov.np',
      password: adminPassword,
      role: 'municipal_admin',
      status: 'active',
      province: 'Sudurpashchim',
      district: 'Kanchanpur',
      municipality: 'Bhimdatta Municipality',
      designation: 'Chief Municipal Admin',
    },
  });

  // 2. Kathmandu Metropolitan City Admin
  await prisma.user.upsert({
    where: { email: 'ayushpant@2073.gov.np' },
    update: {
      password:adminPassword,
      role: 'municipal_admin',
      status: 'active',
      municipality: 'Kathmandu Metropolitan City',
      province: 'Bagmati',
      district: 'Kathmandu',
    },
    create: {
      name: 'Kathmandu Municipal Administrator',
      email: 'ayushpant@2073.gov.np',
      password:adminPassword,
      role: 'municipal_admin',
      status: 'active',
      province: 'Bagmati',
      district: 'Kathmandu',
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