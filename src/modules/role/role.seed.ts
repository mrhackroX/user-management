// src/roles/role.seed.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from './role.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleSeeder implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const roles = ['admin', 'viewer', 'editor'];

    for (const name of roles) {
      const roleRepository = queryRunner.manager.getRepository(Role);
      const exists = await roleRepository.findOne({ where: { name } });
      if (!exists) {
        const role = roleRepository.create({ name });
        await roleRepository.save(role);
        console.log(`Seeded role: ${name}`);
      }
    }
  }
}
