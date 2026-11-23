import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(private readonly prisma: PrismaService) {}

  async autoEscalateOverdueComplaints() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const overdueList = await this.prisma.complaint.findMany({
      where: {
        status: { notIn: ['Resolved', 'Escalated'] },
        createdAt: { lt: sevenDaysAgo },
      },
      select: { id: true },
    });

    if (overdueList.length === 0) return;

    const nowLabel = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    await this.prisma.$transaction(
      overdueList.map((item) =>
        this.prisma.complaint.update({
          where: { id: item.id },
          data: {
            status: 'Escalated',
            isOverdue: true,
            timeline: {
              create: {
                step: 'Auto-escalated to Municipal Admin (unresolved > 7 days)',
                timestamp: nowLabel,
                completed: true,
              },
            },
          },
        }),
      ),
    );
  }

  private formatComplaint(item: any) {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      province: item.province,
      district: item.district,
      municipality: item.municipality,
      ward: item.ward,
      status: item.status,
      filedAt: item.createdAt.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      dueDate: item.dueDate,
      latitude: item.latitude,
      longitude: item.longitude,
      photoUrl: item.photoUrl,
      timeline: (item.timeline ?? []).map((t: any) => ({
        step: t.step,
        timestamp: t.timestamp,
        completed: t.completed,
      })),
    };
  }

  async findAll() {
    const list = await this.prisma.complaint.findMany({
      include: { timeline: { orderBy: { id: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((item) => this.formatComplaint(item));
  }

  async findByUser(citizenId: number) {
    const list = await this.prisma.complaint.findMany({
      where: {
        citizenId,
      },
      include: { timeline: { orderBy: { id: 'asc' } } },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return list.map((item) => this.formatComplaint(item));
  }

  async create(dto: CreateComplaintDto, photoUrl?: string, citizenId?: number) {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const created = await this.prisma.complaint.create({
      data: {
        province: dto.province,
        district: dto.district,
        municipality: dto.municipality,
        ward: dto.ward,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        latitude: dto.latitude,
        longitude: dto.longitude,
        photoUrl: photoUrl ?? null,
        citizenId: citizenId ?? null,
        status: 'Submitted',
        timeline: {
          create: [
            { step: 'Submitted', timestamp: `Today, ${nowTime}`, completed: true },
            {
              step: 'Pending ward engineer review',
              timestamp: 'Awaiting assignment',
              completed: false,
            },
          ],
        },
      },
      include: { timeline: true },
    });

    return {
      data: {
        id: created.id,
        title: created.title,
        category: created.category,
        description: created.description,
        province: created.province,
        district: created.district,
        municipality: created.municipality,
        ward: created.ward,
        status: created.status,
        filedAt: 'Today',
        latitude: created.latitude,
        longitude: created.longitude,
        photoUrl: created.photoUrl,
        timeline: created.timeline,
      },
    };
    
  }
}