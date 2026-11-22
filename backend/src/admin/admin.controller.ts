import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('municipal_admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  getOverview(@Query('ward') ward?: string) {
    return this.adminService.getOverview(ward);
  }

  @Get('complaints')
  getComplaints() {
    return this.adminService.getAllComplaints();
  }

  @Patch('complaints/:id/assign')
  assignComplaint(
    @Param('id', ParseIntPipe) id: number,
    @Body('assigned_to') assignedTo: string,
  ) {
    return this.adminService.assignComplaint(id, assignedTo);
  }

  @Get('projects')
  getProjects() {
    return this.adminService.getProjects();
  }

  @Post('projects')
  createProject(@Body() body: any) {
    return this.adminService.createProject(body);
  }

  @Put('projects/:id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateProject(id, body);
  }

  @Get('budgets')
  getBudgets() {
    return this.adminService.getBudgets();
  }

  @Post('budgets')
  createBudget(@Body() body: any) {
    return this.adminService.createBudget(body);
  }

  @Put('budgets/:id')
  updateBudget(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateBudget(id, body);
  }

  @Get('officials')
  getOfficials() {
    return this.adminService.getOfficials();
  }

  @Patch('officials/:id/approve')
  approveOfficial(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveOfficial(id);
  }

  @Delete('officials/:id/reject')
  rejectOfficial(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.rejectOfficial(id);
  }

  @Patch('officials/:id/status')
  updateOfficialStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'active' | 'deactivated',
  ) {
    return this.adminService.updateOfficialStatus(id, status);
  }

  @Post('officials/invite')
  inviteOfficial(@Body() body: any) {
    return this.adminService.inviteOfficial(body);
  }
}