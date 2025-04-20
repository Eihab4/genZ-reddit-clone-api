/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
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

        const existingUsername = await this.userModel.findOne({ username }).exec();
        if (existingUsername) {
            throw new UnauthorizedException('Username already exists');
        }

        const existingEmail = await this.userModel.findOne({ email }).exec();
        if (existingEmail) {
            throw new UnauthorizedException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userModel.create({ username, email, password: hashedPassword });
        return { message: "User Registered Successfully" };
    }

    async login(loginPayload: LoginRequestDto): Promise<LoginResponseDto> {
        const { username, password } = loginPayload;
        console.log(username)
        const user = await this.userModel.findOne({username}).exec();

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isLoggedIn) {
            throw new UnauthorizedException('User is already logged in');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ 
            id: user._id.toString(),
            username: user.username
        });


        await this.userModel.findByIdAndUpdate(user._id, { isLoggedIn: true });

        const userResponse: UserResponse = {
            username: user.username,
            email: user.email
        };

        return {
            token,
            user: userResponse
        };
    }

    async logout(userId: string): Promise<{ message: string }> {
        await this.userModel.findByIdAndUpdate(userId, { isLoggedIn: false });
        return { message: 'Logged out successfully' };
    }
}
