/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/requests/login.request.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser';
import { jwtPayload } from './utils/jwtPayload';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerPayload: RegisterRequestDto) {
        return this.authService.register(registerPayload);
    }

    @Post('login')
    async login(@Body() loginPayload: LoginRequestDto) {
        return this.authService.login(loginPayload);
    }
    @Post('/logout')
  @UseGuards(AuthGuard)
  public async logout(@CurrentUser() user: jwtPayload) {
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}
