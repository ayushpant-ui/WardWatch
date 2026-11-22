import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { TransparencyModule } from './transparency/transparency.module';
import { AdminModule } from './admin/admin.module';
import { WardModule } from './ward/ward.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ComplaintsModule,
    TransparencyModule,
    AdminModule,
    WardModule,
  ],
})

export class AppModule {}