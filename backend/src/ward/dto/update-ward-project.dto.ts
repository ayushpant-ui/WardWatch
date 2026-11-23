// src/ward/dto/update-ward-project.dto.ts
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateWardProjectDto {
  @IsInt()
  @Min(0)
  @Max(100)
  progress!: number;

  @IsOptional()
  @IsString()
  @IsIn(['On track', 'Delayed', 'Completed'])
  status?: string;
}