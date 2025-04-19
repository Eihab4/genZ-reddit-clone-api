/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schemas';
import { Model } from 'mongoose';
import { RegisterRequestDto } from './dtos/requests/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
     constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
     ) { }
    async register(registerPayload: RegisterRequestDto) {
        const { username, email, password } = registerPayload;
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userModel.create({ username, email, password: hashedPassword });
        return {message:"User Registered Successfully"};
    }
}
