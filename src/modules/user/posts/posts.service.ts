/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreatePostDto } from './dtos/request/create-post.dto';
import { PostResponseDto, CommentResponseDto } from './dtos/response/post-response.dto';

interface Post {
  _id: Types.ObjectId;
  content: string;
  criteria: {
    interests: string[];
    minimumAge: number;
  };
  votes: number;
  comments: {
    content: string;
    author: Types.ObjectId;
    createdAt: Date;
  }[];
  createdAt: Date;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async createPost(username: string, createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post: Post = {
      _id: new Types.ObjectId(),
      content: createPostDto.content,
      criteria: {
        interests: createPostDto.interests,
        minimumAge: createPostDto.minimumAge,
      },
      votes: 0,
      comments: [],
      createdAt: new Date(Date.now()),
    };

    const user = await this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { posts: post } },
        { new: true },
      )

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdPost = user.posts[user.posts.length - 1];
    const response = new PostResponseDto();
    response._id = createdPost._id.toString();
    response.content = createdPost.content;
    response.criteria = createdPost.criteria;
    response.votes = createdPost.votes;
    response.comments = createdPost.comments
      .slice(-5)
      .map(comment => {
        const commentDto = new CommentResponseDto();
        commentDto.content = comment.content;
        commentDto.author = (comment.author as any).username || comment.author.toString();
        commentDto.createdAt = comment.createdAt;
        return commentDto;
      });
    response.createdAt = createdPost.createdAt;
    return response;
  }

  async getAllPosts(username: string): Promise<PostResponseDto[]> {
    const user = await this.userModel
      .findOne({ username })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.posts.map(post => {
      const response = new PostResponseDto();
      response._id = post._id.toString();
      response.content = post.content;
      response.criteria = post.criteria;
      response.votes = post.votes;
      response.comments = post.comments
        .slice(-5)
        .map(comment => {
          const commentDto = new CommentResponseDto();
          commentDto.content = comment.content;
          commentDto.author = (comment.author as any).username || comment.author.toString();
          commentDto.createdAt = comment.createdAt;
          return commentDto;
        });
      response.createdAt = post.createdAt;
      return response;
    });
  }

  async getPostById(username: string, postId: string): Promise<PostResponseDto> {
    const user = await this.userModel
      .findOne({ username })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = user.posts.find(post => post._id.toString() === postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const response = new PostResponseDto();
    response._id = post._id.toString();
    response.content = post.content;
    response.criteria = post.criteria;
    response.votes = post.votes;
    response.comments = post.comments
      .slice(-5)
      .map(comment => {
        const commentDto = new CommentResponseDto();
        commentDto.content = comment.content;
        commentDto.author = (comment.author as any).username || comment.author.toString();
        commentDto.createdAt = comment.createdAt;
        return commentDto;
      });
    response.createdAt = post.createdAt;
    return response;
  }
}