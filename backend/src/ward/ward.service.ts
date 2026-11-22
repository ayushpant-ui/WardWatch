import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWardComplaintDto } from './dto/update-ward-complaint.dto';
import { UpdateWardProjectDto } from './dto/update-ward-project.dto';

interface OfficialUser {
  sub: number;
  name: string;
  email: string;
  role: string;
  municipality?: string;
  wardNo?: number | null;
}

@Injectable()
export class WardService {
  constructor(private readonly prisma: PrismaService) {}

  private extractWardNumber(wardValue: string): number {
    return Number(String(wardValue).replace(/\D/g, '')) || 0;
  }

  private async getOfficialProfile(userId: number) {
    const official = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        municipality: true,
        wardNo: true,
        status: true,
      },
    });

    if (!official || !official.wardNo) {
      throw new ForbiddenException(
        'Ward official profile or assigned ward number not found.',
      );
    }

    return official;
  }

  async getDashboard(user: OfficialUser) {
    const official = await this.getOfficialProfile(user.sub);
    const wardNo = official.wardNo!;

    const [allComplaints, allProjects, allBudgets] = await Promise.all([
      this.prisma.complaint.findMany({
        include: {
          timeline: { orderBy: { id: 'asc' } },
          citizen: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.budgetItem.findMany(),
    ]);

    // Filter strictly to this official's ward (and municipality when present)
    const complaints = allComplaints.filter((c) => {
      const sameWard = this.extractWardNumber(c.ward) === wardNo;
      const sameMuni =
        !official.municipality ||
        !c.municipality ||
        c.municipality.toLowerCase() === official.municipality.toLowerCase();
      return sameWard && sameMuni;
    });

    const projects = allProjects.filter(
      (p) => this.extractWardNumber(p.ward) === wardNo,
    );

    const budgets = allBudgets.filter(
      (b) => this.extractWardNumber(b.ward) === wardNo,
    );

    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    const stats = {
      totalComplaints: complaints.length,
      pendingComplaints: complaints.filter(
        (c) => c.status === 'Submitted' || c.status === 'Assigned',
      ).length,
      inProgressComplaints: complaints.filter((c) => c.status === 'In progress')
        .length,
      resolvedComplaints: complaints.filter((c) => c.status === 'Resolved')
        .length,
      escalatedComplaints: complaints.filter((c) => c.status === 'Escalated')
        .length,
      totalAllocated,
      totalSpent,
      activeProjects: projects.filter((p) => p.status !== 'Completed').length,
    };

    return {
      official: {
        id: official.id,
        name: official.name,
        email: official.email,
        designation: official.designation ?? 'Ward Official',
        municipality: official.municipality ?? 'Bhimdatta Municipality',
        wardNo,
      },
      stats,
      complaints: complaints.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        ward: c.ward,
        municipality: c.municipality,
        status: c.status,
        assignedTo: c.assignedTo,
        dueDate: c.dueDate,
        isOverdue: c.isOverdue,
        photoUrl: c.photoUrl,
        latitude: c.latitude,
        longitude: c.longitude,
        citizenName: c.citizen?.name ?? 'Anonymous Citizen',
        citizenPhone: c.citizen?.phone ?? null,
        filedAt: c.createdAt.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        timeline: c.timeline.map((t) => ({
          id: t.id,
          step: t.step,
          timestamp: t.timestamp,
          completed: t.completed,
        })),
      })),
      projects,
      budgets,
    };
  }

  async updateComplaintStatus(
    user: OfficialUser,
    complaintId: number,
    dto: UpdateWardComplaintDto,
  ) {
    const official = await this.getOfficialProfile(user.sub);
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found.');
    }

    if (this.extractWardNumber(complaint.ward) !== official.wardNo) {
      throw new ForbiddenException(
        'You can only update complaints assigned to your own ward.',
      );
    }

    const nowLabel = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const stepText = dto.note?.trim()
      ? `${dto.status}: ${dto.note.trim()} (by ${official.name})`
      : `Status updated to "${dto.status}" by ${official.name}`;

    const updated = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: dto.status,
        assignedTo:
          dto.assignedTo !== undefined ? dto.assignedTo : complaint.assignedTo,
        dueDate: dto.dueDate !== undefined ? dto.dueDate : complaint.dueDate,
        isOverdue: dto.status === 'Resolved' ? false : complaint.isOverdue,
        timeline: {
          create: {
            step: stepText,
            timestamp: nowLabel,
            completed: true,
          },
        },
      },
      include: {
        timeline: { orderBy: { id: 'asc' } },
      },
    });

    return {
      message: 'Complaint status updated.',
      complaint: updated,
    };
  }

  async updateProjectProgress(
    user: OfficialUser,
    projectId: number,
    dto: UpdateWardProjectDto,
  ) {
    const official = await this.getOfficialProfile(user.sub);
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (this.extractWardNumber(project.ward) !== official.wardNo) {
      throw new ForbiddenException(
        'You can only update projects belonging to your own ward.',
      );
    }

    const resolvedStatus =
      dto.progress === 100
        ? 'Completed'
        : dto.status ?? (project.status === 'Completed' ? 'On track' : project.status);

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        progress: dto.progress,
        status: resolvedStatus,
      },
    });

    return {
      message: 'Project progress updated.',
      project: updated,
    };
  }
}