import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MUNICIPALITY_WARD_COUNTS: Record<string, number> = {
  'Bhimdatta Municipality': 19,
  'Kathmandu Metropolitan City': 32,
};

@Controller('transparency')
export class TransparencyController {
  constructor(private readonly prisma: PrismaService) {}

  private extractWardNumber(wardValue: string): number {
    return Number(String(wardValue).replace(/\D/g, '')) || 0;
  }

  private normalizeMunicipality(input?: string): string {
    if (!input || input === 'all') return 'all';
    const lower = input.trim().toLowerCase();
    if (lower.includes('kathmandu')) return 'Kathmandu Metropolitan City';
    if (lower.includes('bhimdatta')) return 'Bhimdatta Municipality';
    return input.trim();
  }

  @Get()
  async getPublicTransparency(
    @Query('municipality') municipalityQuery?: string,
    @Query('ward') ward?: string,
  ) {
    const selectedMunicipality = this.normalizeMunicipality(municipalityQuery);
    const wardNumber = ward ? this.extractWardNumber(ward) : 0;

    const [complaints, allBudgets, allProjects] = await Promise.all([
      this.prisma.complaint.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          ward: true,
          municipality: true,
          status: true,
          photoUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.budgetItem.findMany(),
      this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Filter complaints by municipality & ward
    const filteredComplaints = complaints.filter((c) => {
      const matchesMuni =
        selectedMunicipality === 'all' ||
        (c.municipality ?? '').toLowerCase() === selectedMunicipality.toLowerCase();
      const matchesWard =
        !wardNumber || this.extractWardNumber(c.ward) === wardNumber;
      return matchesMuni && matchesWard;
    });

    // BudgetItem and Project in schema.prisma don't have a municipality column yet,
    // so filter by ward (and optionally match municipality if prefixed in ward string)
const filteredBudgets = allBudgets.filter((b) => {
      const matchesMuni =
        selectedMunicipality === 'all' ||
        (b.municipality ?? '').toLowerCase() === selectedMunicipality.toLowerCase();
      const matchesWard =
        !wardNumber || this.extractWardNumber(b.ward) === wardNumber;
      return matchesMuni && matchesWard;
    });

const filteredProjects = allProjects.filter((p) => {
      const matchesMuni =
        selectedMunicipality === 'all' ||
        (p.municipality ?? '').toLowerCase() === selectedMunicipality.toLowerCase();
      const matchesWard =
        !wardNumber || this.extractWardNumber(p.ward) === wardNumber;
      return matchesMuni && matchesWard;
    });

    // Summary KPIs
    const totalAllocated = filteredBudgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalComplaints = filteredComplaints.length;
    const resolvedComplaints = filteredComplaints.filter(
      (c) => c.status === 'Resolved',
    ).length;
    const resolutionRate =
      totalComplaints > 0
        ? Math.round((resolvedComplaints / totalComplaints) * 100)
        : 0;

    // Determine ward count for the selected municipality (19 for Bhimdatta, 32 for Kathmandu)
    const maxWards =
      selectedMunicipality === 'all'
        ? 32
        : MUNICIPALITY_WARD_COUNTS[selectedMunicipality] ?? 19;

    const wardMap = new Map<
      number,
      {
        wardNo: number;
        allocated: number;
        spent: number;
        totalComplaints: number;
        resolvedComplaints: number;
        projectsCount: number;
      }
    >();

    for (let w = 1; w <= maxWards; w++) {
      if (!wardNumber || wardNumber === w) {
        wardMap.set(w, {
          wardNo: w,
          allocated: 0,
          spent: 0,
          totalComplaints: 0,
          resolvedComplaints: 0,
          projectsCount: 0,
        });
      }
    }

    filteredBudgets.forEach((b) => {
      const wNum = this.extractWardNumber(b.ward);
      const entry = wardMap.get(wNum);
      if (entry) {
        entry.allocated += b.allocated;
        entry.spent += b.spent;
      }
    });

    filteredComplaints.forEach((c) => {
      const wNum = this.extractWardNumber(c.ward);
      const entry = wardMap.get(wNum);
      if (entry) {
        entry.totalComplaints += 1;
        if (c.status === 'Resolved') entry.resolvedComplaints += 1;
      }
    });

    filteredProjects.forEach((p) => {
      const wNum = this.extractWardNumber(p.ward);
      const entry = wardMap.get(wNum);
      if (entry) {
        entry.projectsCount += 1;
      }
    });

    const wardBreakdown = Array.from(wardMap.values()).map((w) => {
      const utilization =
        w.allocated > 0 ? Math.round((w.spent / w.allocated) * 100) : 0;
      const resolution =
        w.totalComplaints > 0
          ? Math.round((w.resolvedComplaints / w.totalComplaints) * 100)
          : 100;
      return {
        ...w,
        utilization,
        resolution,
      };
    });

    return {
      municipality:
        selectedMunicipality === 'all'
          ? 'All Municipalities'
          : selectedMunicipality,
      maxWards,
      summary: {
        totalAllocated,
        totalSpent,
        utilizationRate:
          totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0,
        totalProjects: filteredProjects.length,
        totalComplaints,
        resolvedComplaints,
        resolutionRate,
      },
      wardBreakdown,
      projects: filteredProjects.map((p) => ({
        id: p.id,
        title: p.name,
        wardNo: this.extractWardNumber(p.ward),
        deadline: p.deadline,
        progress: p.progress,
        status: p.status,
      })),
      recentComplaints: filteredComplaints.slice(0, 25).map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        municipality: c.municipality,
        ward: c.ward,
        status: c.status,
        filedAt: c.createdAt.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      })),
    };
  }
}