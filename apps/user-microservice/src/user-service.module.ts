import { Module } from '@nestjs/common';
import { UserServiceController } from './controllers/user-service.controller';
import { UserService } from './services/user-service.service';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { datasource } from '@app/shared/config';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { USER_SERVICE } from '@app/shared/constants/name-microservice';

const repository = [UserRepository];
@Module({
  imports: [
    RmqModule.register({
      name: USER_SERVICE,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([...repository]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UserServiceController],
  providers: [...repository, UserService],
  exports: [...repository, UserService],
})
export class UserServiceModule {}
