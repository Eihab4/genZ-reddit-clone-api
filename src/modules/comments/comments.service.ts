/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { CommentResponseDto } from './dto/response/comment.response.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createComment(
    userId: string,
    username: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const postOwner = await this.userModel.findOne({ username });
    if (!postOwner) {
      throw new NotFoundException('User not found');
    }

    const post = postOwner.posts.find((p) => p._id.toString() === postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const commenter = await this.userModel.findById(userId);
    if (!commenter) {
      throw new NotFoundException('Commenter not found');
    }

    if (commenter.age === null || commenter.age < post.criteria.minimumAge) {
      throw new ForbiddenException(
        `Commenter does not meet the minimum age requirement of ${post.criteria.minimumAge}`,
      );
    }

    const hasMatchingInterest = post.criteria.interests.some((interest) =>
      commenter.interests.includes(interest),
    );
    if (!hasMatchingInterest) {
      throw new ForbiddenException(
        'Commenter does not share any interests required by the post',
      );
    }

    const comment = {
      _id: new Types.ObjectId(),
      content: createCommentDto.content,
      author: new Types.ObjectId(userId),
      createdAt: new Date(),
    };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { username, 'posts._id': new Types.ObjectId(postId) },
      { 
        $push: { 'posts.$.comments': comment },
        $set: { 'posts.$.createdAt': new Date() },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update post with comment');
    }

    const updatedPost = updatedUser.posts.find((p) => p._id.toString() === postId);
    const createdComment = updatedPost.comments.at(-1);

    return this.mapCommentToResponseDto(createdComment, postId);
  }

  async getCommentsByPostId(username: string, postId: string): Promise<CommentResponseDto[]> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = user.posts.find((p) => p._id.toString() === postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.comments.slice(-5).map((comment) =>
      this.mapCommentToResponseDto(comment, postId)
    );
  }

  async deleteComment(commentId: string, postId: string, userId: string, username: string): Promise<void> {
    const postOwner = await this.userModel.findOne({ username });
    if (!postOwner) {
      throw new NotFoundException('User not found');
    }

    const post = postOwner.posts.find((p) => p._id.toString() === postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment = post.comments.find((c: { _id: Types.ObjectId; content: string; author: Types.ObjectId; createdAt: Date }) => 
      c.author.toString() === userId && c._id.toString() === commentId
    );
    if (!comment) {
      throw new NotFoundException('Comment not found or does not belong to user');
    }

    const updateResult = await this.userModel.findOneAndUpdate(
      {
        username,
        'posts._id': new Types.ObjectId(postId),
      },
      {
        $pull: {
          'posts.$.comments': {
            content: comment.content,
            author: new Types.ObjectId(userId),
            createdAt: comment.createdAt,
          },
        },
        $set: {
          'posts.$.createdAt': new Date(),
        },
      },
      { new: true },
    );

    if (!updateResult) {
      throw new NotFoundException('Failed to delete comment');
    }
  }

  private mapCommentToResponseDto(comment: any, postId: string): CommentResponseDto {
    return {
      id: comment._id.toString(),
      content: comment.content,
      postId,
      createdAt: comment.createdAt,
    };
  }
}