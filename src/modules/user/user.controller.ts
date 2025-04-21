/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser';
import { jwtPayload } from '../auth/utils/jwtPayload';
import { UserService } from './user.service';
import { SettingsRequestDto } from './dtos/requests/settings.request.dto';

@UseGuards(AuthGuard)
@Controller('users/:username/settings')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Patch()
    addInterest(
            @CurrentUser() user: jwtPayload,
            @Body() settingsPayload:SettingsRequestDto ,
            @Param('username') username: string,
    ) {
        return this.userService.addInterests(user.id, username, settingsPayload)
    }
}
