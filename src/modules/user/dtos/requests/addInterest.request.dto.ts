/* eslint-disable prettier/prettier */
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class AddInterestDto {
      @IsArray()
      @ArrayMinSize(1)
      @IsString({ each: true })
      interests: string[];
}