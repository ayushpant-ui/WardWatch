
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateWardComplaintDto } from './dto/update-ward-complaint.dto';
import { UpdateWardProjectDto } from './dto/update-ward-project.dto';
import { WardService } from './ward.service';

@Controller('ward')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ward_admin')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.wardService.getDashboard(req.user);
  }

  @Patch('complaints/:id/status')
  updateComplaintStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWardComplaintDto,
  ) {
    return this.wardService.updateComplaintStatus(req.user, id, dto);
  }

  @Patch('projects/:id')
  updateProjectProgress(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWardProjectDto,
  ) {
    return this.wardService.updateProjectProgress(req.user, id, dto);
  }
}