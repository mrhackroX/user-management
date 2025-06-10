// src/roles/role.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleSeeder } from './role.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleSeeder],
  exports: [TypeOrmModule],
})
export class RoleModule {}
