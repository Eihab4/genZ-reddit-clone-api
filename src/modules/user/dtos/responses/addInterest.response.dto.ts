import { IsArray, IsString } from 'class-validator';

export class AddInterestResponseDto {
  @IsString()
  message: string;

  @IsArray()
  @IsString({ each: true })
  interests: string[];
}
