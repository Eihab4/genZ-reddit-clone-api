/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {

  @ApiProperty({
    description: 'Username',
    example: 'johndoe'
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com'
  })
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse
  })
  user: UserResponse;
} 