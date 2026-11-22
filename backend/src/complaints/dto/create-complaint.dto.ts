import { IsNumber, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComplaintDto {
  @IsString()
  province!: string;

  @IsString()
  district!: string;

  @IsString()
  municipality!: string;

  @IsString()
  ward!: string;

  @IsString()
  category!: string;

  @IsString()
  @MinLength(5)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  longitude!: number;
}