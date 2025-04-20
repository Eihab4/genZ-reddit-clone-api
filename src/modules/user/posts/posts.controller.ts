/* eslint-disable prettier/prettier */
import { Controller, Post, Param, Body, UseGuards, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/request/create-post.dto';
import { PostResponseDto } from './dtos/response/post-response.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../../decorators/currentUser';
import { jwtPayload } from '../../auth/utils/jwtPayload';

@UseGuards(AuthGuard)
@Controller('/users/:username/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @CurrentUser() user: jwtPayload,
    @Body() createPostDto: CreatePostDto,
    @Param('username') username: string,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(user.id, username, createPostDto);
  }

  @Get('/')
  getAllPosts(
    @CurrentUser() user: jwtPayload,
    @Param('username') username: string,
  ): Promise<PostResponseDto[]> {
    return this.postsService.getAllPosts(user.id, username);
  }

  @Get(':postId')
  getPostById(
    @CurrentUser() user: jwtPayload,
    @Param('username') username: string,
    @Param('postId') postId: string,
  ): Promise<PostResponseDto> {
    return this.postsService.getPostById(user.id, username, postId);
  }
}