import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterOfficialDto } from './dto/register-official.dto';
import { RegisterCitizenDto } from './dto/register-citizen.dto'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('officials/register')
  registerOfficial(@Body() dto: RegisterOfficialDto) {
    return this.authService.registerOfficial(dto);
  }

  @Post('user/register')
  registerCitizen(@Body() dto: RegisterCitizenDto) {
    return this.authService.registerCitizen(dto);
  }
}