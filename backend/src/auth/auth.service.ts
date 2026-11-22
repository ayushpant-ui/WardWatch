import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterOfficialDto } from './dto/register-official.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerOfficial(dto: RegisterOfficialDto) {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException({
        errors: { password_confirmation: ['Passwords do not match.'] },
      });
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException({
        errors: { email: ['An account with this official email already exists.'] },
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const official = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        municipality: dto.municipality,
        wardNo: dto.ward_no,
        designation: dto.designation,
        password: hashedPassword,
        role: 'ward_admin',
        status: 'pending',
      },
    });

    return {
      message:
        'Registration request submitted. Your account will stay inactive until approved by the Municipal Admin.',
      official: {
        id: official.id,
        name: official.name,
        email: official.email,
        municipality: official.municipality,
        ward_no: official.wardNo,
        designation: official.designation,
        role: official.role,
        status: official.status,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role === 'ward_admin' && user.status === 'pending') {
      throw new ForbiddenException(
        'Your official account is still pending approval from the Municipal Admin.',
      );
    }

    if (user.status === 'deactivated') {
      throw new ForbiddenException(
        'Your account has been deactivated. Contact the Municipal Admin.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      wardNo: user.wardNo,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Flat response matching LoginForm.tsx destructuring
    return {
      accessToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      municipality: user.municipality,
      ward_no: user.wardNo,
    };
  }
}