import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.complaint.findMany({
      include: { timeline: { orderBy: { id: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((item) => ({
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
      timeline: item.timeline.map((t) => ({
        step: t.step,
        timestamp: t.timestamp,
        completed: t.completed,
      })),
    }));
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