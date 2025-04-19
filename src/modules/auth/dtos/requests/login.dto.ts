import { IsString, IsNotEmpty, IsEmail, ValidateIf } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o: LoginRequestDto) => !o.email || (o.email && !o.username))
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o: LoginRequestDto) => !o.username || (o.username && !o.email))
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
