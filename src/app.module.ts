/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/user/posts/comments/comments.module';
import { CommentsController } from './modules/user/posts/comments/comments.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URI'),
      }),
    }),
    UserModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController, CommentsController],
  providers: [AppService],
})
export class AppModule {}
