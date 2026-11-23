import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateWardComplaintDto {
  @IsString()
  @IsIn(['Submitted', 'Assigned', 'In progress', 'Resolved', 'Escalated'])
  status!: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  note?: string;
}