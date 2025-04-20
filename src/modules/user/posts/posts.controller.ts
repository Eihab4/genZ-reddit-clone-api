/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dtos/request/create-post.dto';
import { PostResponseDto } from './dtos/response/post-response.dto';
import { AuthGuard } from './../../auth/guards/auth.guard';
import { PostsService } from './posts.service';

@Controller('users/:username/posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(
    @Param('username') username: string,
    @Body() createPostPayload: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(username, createPostPayload);
  }

  @Get()
  async getAllPosts(
    @Param('username') username: string,
  ): Promise<PostResponseDto[]> {
    return this.postsService.getAllPosts(username);
  }

  @Get(':postId')
  async getPostById(
    @Param('username') username: string,
    @Param('postId') postId: string,
  ): Promise<PostResponseDto> {
    return this.postsService.getPostById(username, postId);
  }
} 