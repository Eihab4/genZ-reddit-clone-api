/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dtos/requests/register.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/requests/login.dto';

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
}
