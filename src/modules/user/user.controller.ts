import { Body, Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ResponseHandler } from 'src/utils/responseHandler';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    const res = await this.userService.getAllUsers();
    return ResponseHandler.success(
      'User Fetched successfully',
      HttpStatus.CREATED,
      res,
    );
  }
}
