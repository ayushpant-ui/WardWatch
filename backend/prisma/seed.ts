import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const officialPassword = await bcrypt.hash('Official@12345', 10);

  // 1. Seed Municipal Admin
  await prisma.user.upsert({
    where: { email: 'admin@wardwatch.gov.np' },
    update: {},
    create: {
      name: 'Municipal Administrator',
      email: 'admin@wardwatch.gov.np',
      password: adminPassword,
      role: 'municipal_admin',
      status: 'active',
      municipality: 'Kathmandu Metropolitan City',
      designation: 'Chief Municipal Admin',
    },
  });

  // 2. Seed Active & Pending Ward Officials
  await prisma.user.upsert({
    where: { email: 's.karki@wardwatch.gov.np' },
    update: {},
    create: {
      name: 'S. Karki',
      email: 's.karki@wardwatch.gov.np',
      password: officialPassword,
      role: 'ward_admin',
      status: 'active',
      municipality: 'Kathmandu Metropolitan City',
      wardNo: 10,
      designation: 'Ward Engineer',
    },
  });

  await prisma.user.upsert({
    where: { email: 'sunita.rai@example.com' },
    update: {},
    create: {
      name: 'Sunita Rai',
      email: 'sunita.rai@example.com',
      password: officialPassword,
      role: 'ward_admin',
      status: 'pending',
      municipality: 'Kathmandu Metropolitan City',
      wardNo: 5,
      designation: 'Ward Secretary',
    },
  });

  // 3. Seed Sample Complaint with Timeline
  const existingComplaints = await prisma.complaint.count();
  if (existingComplaints === 0) {
    await prisma.complaint.create({
      data: {
        title: 'Broken road near school gate',
        category: 'Road',
        description: 'Deep potholes near the school entrance causing waterlogging.',
        province: 'Bagmati',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metro',
        ward: 'Ward 10',
        status: 'In progress',
        latitude: 27.7172,
        longitude: 85.324,
        assignedTo: 'S. Karki',
        dueDate: '4 Nov',
        timeline: {
          create: [
            { step: 'Submitted', timestamp: '28 Oct, 9:40', completed: true },
            { step: 'Assigned to ward engineer', timestamp: '29 Oct, 11:15', completed: true },
            { step: 'Repair work started', timestamp: 'Due by 4 Nov', completed: false },
          ],
        },
      },
    });
  }

  // 4. Seed Projects & Budgets
  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: [
        { name: 'Drainage upgrade', ward: 'Ward 10', progress: 70, status: 'On track', deadline: '30 Jan' },
        { name: 'Community hall', ward: 'Ward 4', progress: 35, status: 'Delayed', deadline: '15 Dec' },
        { name: 'Road paving, phase 2', ward: 'Ward 7', progress: 100, status: 'Completed', deadline: '10 Nov' },
      ],
    });
  }

  if ((await prisma.budgetItem.count()) === 0) {
    await prisma.budgetItem.createMany({
      data: [
        { ward: 'Ward 10', category: 'Roads', allocated: 5.0, spent: 4.0, updatedBy: 'Ward 10 official' },
        { ward: 'Ward 10', category: 'Water supply', allocated: 3.0, spent: 1.2, updatedBy: 'Ward 10 official' },
        { ward: 'Ward 4', category: 'Sanitation', allocated: 2.5, spent: 2.1, updatedBy: 'Municipal admin' },
      ],
    });
  }

  console.log('WardWatch database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });