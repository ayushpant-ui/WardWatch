import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterOfficialDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  municipality!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  ward_no!: number;

  @IsString()
  @MinLength(2)
  designation!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(8)
  password_confirmation!: string;
}