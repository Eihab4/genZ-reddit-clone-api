/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => !o.email)
  username?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf(o => !o.username)
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
