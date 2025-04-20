/* eslint-disable prettier/prettier */
import { IsString, IsArray, IsNumber, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];

  @IsNumber()
  @IsNotEmpty()
  minimumAge: number;
} 