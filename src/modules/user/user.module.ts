import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserController } from './user.controller';
import { JwtService } from 'src/utils/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
