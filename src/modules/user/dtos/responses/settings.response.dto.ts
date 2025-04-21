/* eslint-disable prettier/prettier */
import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';

export class SettingsResponseDto {
  @IsString()
  message: string;

  @IsArray()
  @IsString({ each: true })
  interests: string[];

    @IsInt()
    @Min(1)
    @Max(120)
    age: number;
}
