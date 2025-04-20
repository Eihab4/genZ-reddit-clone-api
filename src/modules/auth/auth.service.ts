/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schemas';
import { Model } from 'mongoose';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dtos/requests/login.request.dto';
import { LoginResponseDto, UserResponse } from './dtos/responses/login.response.dto';
import { RegisterResponseDto } from './dtos/responses/register.response.dto';

@Injectable()
export class AuthService {
     constructor(
         @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
         private readonly jwtService: JwtService
     ) { }

    async register(registerPayload: RegisterRequestDto): Promise<RegisterResponseDto> {
        const { username, email, password } = registerPayload;
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userModel.create({ username, email, password: hashedPassword });
        return { message: "User Registered Successfully" };
    }

    async login(loginPayload: LoginRequestDto): Promise<LoginResponseDto> {
        const { username, email, password } = loginPayload;
        
        const user = await this.userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        }).lean();

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ 
            id: user._id.toString(),
            username: user.username
        });

        const userResponse: UserResponse = {
            username: user.username,
            email: user.email
        };

        return {
            token,
            user: userResponse
        };
    }
}
