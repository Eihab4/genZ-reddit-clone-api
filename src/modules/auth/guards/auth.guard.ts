/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import errorMessages from '../../../config/errorMessages.json';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      this.logger.warn('Missing Authorization header');
      throw new UnauthorizedException(errorMessages.auth_errors.missing_token);
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      this.logger.warn('Invalid token format in Authorization header');
      throw new UnauthorizedException(errorMessages.auth_errors.invalid_token_format);
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error('JWT_SECRET is not defined in configuration');
        throw new UnauthorizedException('Server configuration error: JWT_SECRET missing');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      this.logger.debug(`Token verified successfully for user: ${payload.username}`);

      req['user'] = payload;
      this.logger.debug(`User ${payload.username} authenticated successfully`);
      return true;
    } catch (error: unknown) {
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