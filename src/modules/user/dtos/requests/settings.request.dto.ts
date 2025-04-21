/* eslint-disable prettier/prettier */
import { ArrayMinSize, IsArray, IsInt, IsString, Max, Min } from "class-validator";

export class SettingsRequestDto {
      @IsArray()
      @ArrayMinSize(1)
      @IsString({ each: true })
      interests: string[];

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;
}