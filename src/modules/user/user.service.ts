/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AddInterestDto } from './dtos/requests/addInterest.request.dto';
import { AddInterestResponseDto } from './dtos/responses/addInterest.response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async addInterests(
    userId: string,
    username: string,
    addInterestPayload: AddInterestDto,
  ): Promise<AddInterestResponseDto> {
    const user = await this.userModel.findById(userId);

    if (!user || user.username !== username) {
      throw new Error('User not found or unauthorized.');
    }
    const newInterests = addInterestPayload.interests.filter(
      (interest) => !user.interests.includes(interest),
    );
    user.interests.push(...newInterests);
    await user.save();

    const response: AddInterestResponseDto = {
      message: 'Interests added successfully',
      interests: user.interests,
    };

    return response;
  }
}
