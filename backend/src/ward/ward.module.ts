// src/ward/ward.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';

@Module({
  imports: [PrismaModule],
  controllers: [WardController],
  providers: [WardService],
})
export class WardModule {}