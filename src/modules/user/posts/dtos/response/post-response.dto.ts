/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'The username of the comment author',
    example: 'john_doe',
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: 'The date when the comment was created',
    example: '2024-04-20T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is my first post!',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'The criteria for the post',
    type: 'object',
    properties: {
      interests: {
        type: 'array',
        items: { type: 'string' },
        example: ['technology', 'programming'],
      },
      minimumAge: {
        type: 'number',
        example: 18,
      },
    },
  })
  @Expose()
  criteria: {
    interests: string[];
    minimumAge: number;
  };

  @ApiProperty({
    description: 'The number of votes the post has received',
    example: 5,
  })
  @Expose()
  votes: number;

  @ApiProperty({
    description: 'The comments on the post',
    type: [CommentResponseDto],
  })
  @Expose()
  comments: CommentResponseDto[];

  @ApiProperty({
    description: 'The date when the post was created',
    example: '2024-04-20T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}