/* eslint-disable prettier/prettier */
import { Controller, Post, Param, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/request/create-post.request.dto';
import { PostResponseDto } from './dtos/response/post-response.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../../decorators/currentUser';
import { jwtPayload } from '../../auth/utils/jwtPayload';
import { VotePostDto } from './dtos/request/vote.request.dto';

@UseGuards(AuthGuard)
@Controller('/users/:username/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  createPost(
    @CurrentUser() user: jwtPayload,
    @Body() createPostPayload: CreatePostDto,
    @Param('username') username: string,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(user.id, username, createPostPayload);
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
  @Patch(':postId')
  voteOnPost(
    @CurrentUser() user: jwtPayload,
    @Param('username') username: string,
    @Param('postId') postId: string,
    @Body()votePayload:VotePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.voteOnPost(user.id, username, postId, votePayload);
  }
}