/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { jwtPayload } from 'src/modules/auth/utils/jwtPayload';
import { CurrentUser } from 'src/decorators/currentUser';
import { CommentResponseDto } from '../dtos/response/post-response.dto';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users/:username/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/')
  async createComment(
    @CurrentUser() user: jwtPayload,
    @Body() createCommentPayload: CreateCommentDto,
    @Param('username') username: string,
    @Param('postId') postId: string,
  ): Promise<CommentResponseDto> {
    return this.commentService.createComment(user.id, username, postId, createCommentPayload);
  }

  @Get('/')
  async getComments (
    @CurrentUser()user:jwtPayload,
    @Param('postId') postId: string,
    @Param('username') username: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getCommentsByPostId(username,postId);
  }

  @Delete('/:commentId')
  async deleteComment(
    @CurrentUser() user: jwtPayload,
    @Param('commentId') commentId: string,
    @Param('username') username: string,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this.commentService.deleteComment(commentId, postId, user.id, username);
  }
}