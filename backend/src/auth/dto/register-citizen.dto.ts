import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCitizenDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  password_confirmation?: string;

  @IsOptional()
  @IsString()
  passwordConfirmation?: string;
}