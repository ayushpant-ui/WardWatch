import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterOfficialDto } from '../auth/dto/register-official.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createOfficial(dto: RegisterOfficialDto) {
    if (
      dto.password_confirmation !== undefined &&
      dto.password !== dto.password_confirmation
    ) {
      throw new BadRequestException({
        errors: { password_confirmation: ['Passwords do not match.'] },
      });
    }

    const normalizedEmail = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException({
        errors: {
          email: ['An account with this official email already exists.'],
        },
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const official = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: normalizedEmail,
        phone: dto.phone ?? null,
        municipality: dto.municipality,
        wardNo: dto.ward_no,
        designation: dto.designation,
        password: hashedPassword,
        role: 'ward_admin',
        status: 'active',
      },
    });

    return {
      message: 'Ward official account created and activated.',
      official: {
        id: official.id,
        name: official.name,
        email: official.email,
        phone: official.phone,
        municipality: official.municipality,
        ward_no: official.wardNo,
        designation: official.designation,
        role: official.role,
        status: official.status,
      },
    };
  }

  async getOverview(ward?: string) {
    const where = ward ? { ward } : {};
    const [openComplaints, overdueComplaints, queue] = await Promise.all([
      this.prisma.complaint.count({
        where: { ...where, status: { not: 'Resolved' } },
      }),
      this.prisma.complaint.count({
        where: { ...where, isOverdue: true },
      }),
      this.prisma.complaint.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      stats: {
        openComplaints,
        overdueComplaints,
        avgResolutionDays: 4.1,
        municipalityScore: 71,
      },
      queue,
      ranking: [
        { ward: 'Ward 10', score: 78 },
        { ward: 'Ward 4', score: 72 },
        { ward: 'Ward 7', score: 65 },
        { ward: 'Ward 2', score: 58 },
        { ward: 'Ward 9', score: 51 },
      ],
    };
  }

  getAllComplaints() {
    return this.prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  assignComplaint(id: number, assignedTo: string) {
    return this.prisma.complaint.update({
      where: { id },
      data: { assignedTo, status: 'Assigned' },
    });
  }

  getProjects() {
    return this.prisma.project.findMany({ orderBy: { id: 'desc' } });
  }

  createProject(data: {
    name: string;
    ward: string;
    progress: number;
    status: string;
    deadline: string;
  }) {
    return this.prisma.project.create({ data });
  }

  updateProject(
    id: number,
    data: Partial<{
      name: string;
      ward: string;
      progress: number;
      status: string;
      deadline: string;
    }>,
  ) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async getBudgets() {
    const [items, recentChanges] = await Promise.all([
      this.prisma.budgetItem.findMany({ orderBy: { id: 'desc' } }),
      this.prisma.budgetAuditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { items, recentChanges };
  }

  async createBudget(data: {
    ward: string;
    category: string;
    allocated: number;
    spent: number;
  }) {
    const created = await this.prisma.budgetItem.create({
      data: { ...data, updatedBy: 'Municipal admin' },
    });

    await this.prisma.budgetAuditLog.create({
      data: {
        ward: data.ward,
        category: data.category,
        description: `Allocated Rs ${data.allocated.toFixed(1)}M`,
        updatedBy: 'Municipal admin',
        date: 'Today',
      },
    });

    return created;
  }

  async updateBudget(
    id: number,
    data: { ward: string; category: string; allocated: number; spent: number },
  ) {
    const existing = await this.prisma.budgetItem.findUnique({ where: { id } });
    const updated = await this.prisma.budgetItem.update({
      where: { id },
      data: { ...data, updatedBy: 'Municipal admin' },
    });

    if (existing) {
      await this.prisma.budgetAuditLog.create({
        data: {
          ward: data.ward,
          category: data.category,
          description: `Spent Rs ${existing.spent.toFixed(1)}M to Rs ${data.spent.toFixed(1)}M`,
          updatedBy: 'Municipal admin',
          date: 'Today',
        },
      });
    }

    return updated;
  }

  async getOfficials(adminUserId?: number) {
    let adminMunicipality: string | null = null;

    if (adminUserId) {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminUserId },
        select: { municipality: true },
      });
      adminMunicipality = admin?.municipality ?? null;
    }

    const list = await this.prisma.user.findMany({
      where: {
        role: 'ward_admin',
        ...(adminMunicipality
          ? {
              municipality: {
                equals: adminMunicipality,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return list.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      municipality: u.municipality ?? 'Unassigned',
      ward: u.wardNo ? `Ward ${u.wardNo}` : 'Unassigned',
      ward_no: u.wardNo,
      designation: u.designation,
      requestedAt: u.createdAt.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      lastLogin: u.lastLoginAt
        ? u.lastLoginAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })
        : 'Never',
      status: u.status,
    }));
  }

  approveOfficial(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  rejectOfficial(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  updateOfficialStatus(id: number, status: 'active' | 'deactivated') {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async inviteOfficial(data: {
    name: string;
    email: string;
    ward: string;
    designation: string;
  }) {
    const tempPassword = await bcrypt.hash('WardWatch@123', 10);
    const wardNumber = Number(data.ward.replace(/\D/g, '')) || 1;

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: tempPassword,
        role: 'ward_admin',
        status: 'active',
        wardNo: wardNumber,
        designation: data.designation,
      },
    });
  }
}
