import { UserEntity } from '@app/shared/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    console.log('Finding user by phone:', phone);
    return this.findOne({ where: { phone } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.findOne({ where: { id } });
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.save(user);
  }
}
