/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser';
import { jwtPayload } from '../auth/utils/jwtPayload';
import { UserService } from './user.service';
import { AddInterestDto } from './dtos/requests/addInterest.request.dto';

@UseGuards(AuthGuard)
@Controller('users/:username')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Patch()
    addInterest(
            @CurrentUser() user: jwtPayload,
            @Body() addInterestPayload:AddInterestDto ,
            @Param('username') username: string,
    ) {
        return this.userService.addInterests(user.id, username, addInterestPayload)
    }
}
