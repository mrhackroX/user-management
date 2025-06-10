import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ResponseHandler } from 'src/utils/responseHandler';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create-user')
  async createUser(@Body() data: CreateUserDto) {
    await this.authService.createUser(data);
    return ResponseHandler.success(
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @Post('/login')
  async login(@Body() data: LoginDto) {
    const res = await this.authService.login(data);
    return ResponseHandler.success('Login successfull', HttpStatus.OK, res);
  }
}
