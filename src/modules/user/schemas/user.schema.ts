/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ default:null})
  age: number;

  @Prop({
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      content: { type: String, required: true },
      criteria: {
        interests: [{ type: String, required: true }],
        minimumAge: { type: Number, required: true },
      },
      votes: { type: Number, default: 0 },
      comments: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
      }],
      createdAt: { type: Date, default: Date.now },
    }],
    default: [],
  })
  posts: {
    _id: mongoose.Types.ObjectId;
    content: string;
    criteria: {
      interests: string[];
      minimumAge: number;
    };
    votes: number;
    comments: {
      _id: mongoose.Types.ObjectId;
      content: string;
      author: mongoose.Types.ObjectId;
      createdAt: Date;
    }[];
    createdAt: Date;
  }[];

  @Prop({ default: false })
  isLoggedIn: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
