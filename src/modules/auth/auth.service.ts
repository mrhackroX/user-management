import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from 'src/utils/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(dataToCreate: CreateUserDto): Promise<void> {
    try {
      const existingUser = await this.userService.checkUserByEmail(
        dataToCreate.email,
      );
      if (existingUser) {
        throw new BadRequestException('User with this email already exists.');
      }

      const hashedPassword = await bcrypt.hash(dataToCreate.password, 10);
      dataToCreate['password'] = hashedPassword;

      await this.userService.createUser(dataToCreate);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user. Please try again.');
    }
  }

  async login(dataToLogin: LoginDto): Promise<string> {
    try {
      const user = await this.userService.checkUserByEmail(dataToLogin.email);
      if (!user) {
        throw new BadRequestException('Invalid email or password.');
      }

      const isPasswordValid = await bcrypt.compare(
        dataToLogin.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password.');
      }

      const payload = {
        email: user.email,
      };
      const accessToken = this.jwtService.sign(payload);

      return accessToken;
    } catch (error) {
      console.error('Error logging in:', error);
      throw new BadRequestException('Failed to login. Please try again.');
    }
  }
}
