/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dtos/requests/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerPayload: RegisterRequestDto) {
        return this.authService.register(registerPayload);
    }
}
