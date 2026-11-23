import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ComplaintsModule } from '../complaints/complaints.module';

@Module({
  imports:[ComplaintsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}