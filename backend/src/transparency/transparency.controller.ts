import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('transparency')
export class TransparencyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getWardTransparency(@Query('ward') ward = 'Ward 10') {
    const [budgets, projects] = await Promise.all([
      this.prisma.budgetItem.findMany({ where: { ward } }),
      this.prisma.project.findMany({ where: { ward } }),
    ]);

    return {
      budgets,
      projects,
      scores: [
        { rank: 1, ward: 'Ward 10', score: 78 },
        { rank: 2, ward: 'Ward 4', score: 72 },
        { rank: 3, ward: 'Ward 7', score: 65 },
      ],
    };
  }
}