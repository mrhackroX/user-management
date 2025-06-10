import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  sign(payload: any): string {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }

  verify(token: string): any {
    try {
      return this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error: any) {
      throw new Error('Invalid token', error);
    }
  }
}
