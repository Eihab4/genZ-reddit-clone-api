/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Document } from 'mongoose';


@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isLoggedIn: boolean;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);