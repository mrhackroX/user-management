import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';

// import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}
  async checkUserByEmail(email: string): Promise<CreateUserDto | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: { email },
      });

      return existingUser;
    } catch (err) {
      console.error('Error checking user by email:', err);
      throw new Error('Database error occurred while checking user by email.');
    } finally {
      await queryRunner.release();
    }
  }

  async createUser(data: CreateUserDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const newUser = userRepository.create(data);
      await userRepository.save(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error('Database error occurred while creating user.');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllUsers(): Promise<CreateUserDto[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'name', 'email', 'phone', 'role'],
      });
      return users;
    } catch (err) {
      console.error('Error fetching all users:', err);
      throw new Error('Database error occurred while fetching all users.');
    } finally {
      await queryRunner.release();
    }
  }
}
