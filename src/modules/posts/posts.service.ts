/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dtos/request/create-post.request.dto';
import { PostResponseDto, CommentResponseDto } from './dtos/response/post-response.dto';
import { VotePostDto } from './dtos/request/vote.request.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

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
  ) {}

  async createPost(userId: string, username: string, createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user || user.username !== username) {
      throw new UnauthorizedException('You can only create posts for your own account');
    }

    const post: Post = {
      _id: new Types.ObjectId(),
      content: createPostDto.content,
      criteria: {
        interests: createPostDto.interests,
        minimumAge: createPostDto.minimumAge,
      },
      votes: 0,
      comments: [],
      createdAt: new Date(),
    };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { username },
      { $push: { posts: post } },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const createdPost = updatedUser.posts[updatedUser.posts.length - 1];
    return this.mapPostToResponseDto(createdPost);
  }

  async getAllPosts(userId: string, username: string): Promise<PostResponseDto[]> {
    const user = await this.userModel.findById(userId);
    if (!user || user.username !== username) {
      throw new UnauthorizedException('You can only view posts for your own account');
    }

    const userFromDb = await this.userModel.findOne({ username });

    if (!userFromDb) {
      throw new NotFoundException('User not found');
    }

    return userFromDb.posts.map(post => this.mapPostToResponseDto(post));
  }

  async getPostById(userId: string, username: string, postId: string): Promise<PostResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user || user.username !== username) {
      throw new UnauthorizedException('You can only view posts for your own account');
    }

    const userFromDb = await this.userModel.findOne({ username });

    if (!userFromDb) {
      throw new NotFoundException('User not found');
    }

    const post = userFromDb.posts.find(post => post._id.toString() === postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mapPostToResponseDto(post);
  }

  async voteOnPost(
    userId: string,
    username: string,
    postId: string,
    votePayload: VotePostDto,
  ): Promise<PostResponseDto> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const postIndex = user.posts.findIndex(p => p._id.toString() === postId);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    user.posts[postIndex].votes += votePayload.vote;

    await user.save();

    return this.mapPostToResponseDto(user.posts[postIndex]);
  }

  async getTimelinePosts(userId: string): Promise<PostResponseDto[]> {
    console.log(userId)
    const users = await this.userModel
      .find({ 'posts.0': { $exists: true } })
      .select('posts')
      .lean()
      .exec();

    const allPosts = users.flatMap(user => user.posts);

    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allPosts.map(post => this.mapPostToResponseDto(post));
  }

  private mapPostToResponseDto(post: Post): PostResponseDto {
    const response = new PostResponseDto();
    response._id = post._id.toString();
    response.content = post.content;
    response.criteria = post.criteria;
    response.votes = post.votes;
    response.comments = post.comments.slice(-5).map(comment => {
      const commentDto = new CommentResponseDto();
      commentDto.content = comment.content;
      commentDto.createdAt = comment.createdAt;
      return commentDto;
    });
    response.createdAt = post.createdAt;
    return response;
  }
}