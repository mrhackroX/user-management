/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { roleMapping } from 'src/utils/roleMapping';
import { ResponseHandler } from 'src/utils/responseHandler';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: Record<string, unknown> =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

      const email =
        typeof payload.email === 'string' ? payload.email : undefined;
      if (!email) {
        throw new UnauthorizedException('Invalid token payload: missing email');
      }
      const userRole = await this.userService.checkUserByEmail(email);

      if (!userRole) {
        throw new UnauthorizedException('User not found');
      }

      const modules = roleMapping[userRole.role];

      const { method, originalUrl } = request;

      const moduleName = originalUrl.split('/')[1];

      console.log(method, originalUrl, moduleName);
      if (!modules[moduleName]) {
        return ResponseHandler.error(
          'You are not authorized for this module',
          401,
        );
      }

      if (!modules[moduleName].includes(method)) {
        return ResponseHandler.error(
          'You are not authorized for this route',
          401,
        );
      }
    } catch (err) {
      console.log('Err-', err);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
