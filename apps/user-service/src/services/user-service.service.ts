import { UserEntity } from '@app/shared/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(dto: Partial<UserEntity>) {
    const user = await this.userRepository.createUser(dto);
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async getUserByPhone(phone: string) {
    const user = await this.userRepository.findOneBy({ phone });
    console.log('User by phone:', user);
    return user ?? null;
  }
}
