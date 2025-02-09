import { UserEntity } from '@app/shared/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { BadRequestRpcException } from '@app/shared/filters/custom-rpc-exception/custm-rpc-exception';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(dto: Partial<UserEntity>) {
    if (!dto.password) {
      throw new BadRequestRpcException('رمز عبور اجباری است');
    }

    dto.password = await bcrypt.hash(dto.password, 10);

    console.log(dto);
    if (!dto.referralCode) {
      dto.referralCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
    }

    const user = await this.userRepository.createUser({
      ...dto,
    });
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

  async getUserByReferralCode(referralCode: string) {
    const user = await this.userRepository.findOneBy({ referralCode });
    return user;
  }
}
