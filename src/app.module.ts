import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';

import { AppLoggerMiddleware } from './utils/appLogger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/user/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { Role } from './modules/role/role.entity';
import { DocumentModule } from './modules/document/document.module';
import { Document } from './modules/document/document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5433', 10),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User, Role, Document],
          synchronize: true,
          logging: ['error', 'warn'],
          extra: {
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
          },
        });

        await dataSource.initialize();
        return dataSource.options;
      },
    }),
    AuthModule,
    UserModule,
    RoleModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Connected to PostgreSQL successfully!!!');
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
