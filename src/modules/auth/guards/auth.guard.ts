/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';
import errorMessages from '../../../config/errorMessages.json';

export interface JwtPayload {
  id: string;
  username: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      this.logger.warn('Invalid token format in Authorization header');
      throw new UnauthorizedException(errorMessages.auth_errors.invalid_token_format);
    }
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    try {
      const token = this.extractTokenFromHeader(request);
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error('JWT_SECRET is not defined in configuration');
        throw new UnauthorizedException('Server configuration error: JWT_SECRET missing');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      this.logger.debug(`Token verified successfully for user: ${payload.username}`);

      const user = await this.userModel.findById(payload.id);
      if (!user) {
        this.logger.warn(`User not found for ID: ${payload.id}`);
        throw new UnauthorizedException(errorMessages.auth_errors.blacklisted_token);
      }

      request['user'] = {
        id: payload.id,
        username: payload.username,
      };
      this.logger.debug(`User ${payload.username} authenticated successfully`);

      return true;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Authentication failed: ${err.message}`, err.stack);

      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException(errorMessages.auth_errors.unauthorized);
    }
  }
}