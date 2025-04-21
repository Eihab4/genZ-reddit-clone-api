/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AddInterestsAndAgeDto } from './dtos/requests/addInterest.request.dto';
import { AddInterestResponseDto } from './dtos/responses/addInterest.response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async addInterests(
    userId: string,
    username: string,
    addInterestandAgePayload: AddInterestsAndAgeDto,
  ): Promise<AddInterestResponseDto> {
    const user = await this.userModel.findById(userId);

    if (!user || user.username !== username) {
      throw new Error('User not found or unauthorized.');
    }
    const newInterests = addInterestandAgePayload.interests.filter(
      (interest) => !user.interests.includes(interest),
    );
    user.interests.push(...newInterests);
    user.age=addInterestandAgePayload.age
    await user.save();

    const response: AddInterestResponseDto = {
      message: 'Interests added successfully',
      interests: user.interests,
      age:user.age
    };

    return response;
  }
}
