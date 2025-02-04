import { BadRequestRpcException } from './../../../libs/shared/src/filters/custom-rpc-exception/custm-rpc-exception';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import {
  REFERRAL_SERVICE,
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { LoginDto } from '@app/shared/dtos/auth/login.dto';
import { SignupDto } from '@app/shared/dtos/auth/signup.dto';
import { UserRoleEnum } from '@app/shared/enums/role.enum';
import { ConfilctRpcException } from '@app/shared/filters/custom-rpc-exception/custm-rpc-exception';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user-service/src/services/user-service.service';
import * as bcrypt from 'bcrypt';
import { firstValueFrom, lastValueFrom, Observable, retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
    @Inject(SCORE_SERVICE) private scoreClient: ClientRMQ,
    @Inject(REFERRAL_SERVICE) private referralClient: ClientRMQ,
  ) {}

  async login(dto: LoginDto) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'getUserByPhone' }, dto.phone),
    );
    console.log('User:', user);

    if (!user)
      throw new ConfilctRpcException('نام کاربری یا رمز عبور اشتباه است');

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword)
      throw new ConfilctRpcException('نام کاربری یا رمز عبور اشتباه است');

    const token = await this.generateToken(user);
    return { token };
  }

  async signup(dto: SignupDto) {
    console.log('Checking if user exists:', dto.phone);
    const existingUser = await firstValueFrom(
      this.userClient.send({ cmd: 'getUserByPhone' }, dto.phone),
    );
    console.log('Existing user:', existingUser);
    if (existingUser)
      throw new BadRequestRpcException('این کاربر از قبل وجود دارد');
    console.log('Creating user:', dto);
    const user = await this.userClient
      .send(
        { cmd: 'createUser' },
        {
          ...dto,
          role: UserRoleEnum.USER,
        },
      )
      .toPromise();

    const addScore = await this.scoreClient
      .emit({ cmd: KEYS_RQM.ADD_POINTS_TO_USER }, { userId: user.id, score: 1 })
      .toPromise();

    if (dto.referralCode) {
      const referral = await this.referralClient
        .emit(
          { cmd: KEYS_RQM.USE_REFERRAL },
          { userId: user.id, referralCode: dto.referralCode },
        )
        .toPromise();
      console.log(`referralCount >> ${referral}`);
      console.log('Points added to user:', user.id);
    }
    const token = await this.generateToken(user);
    return { token };
  }

  private async generateToken(user: any) {
    const payload = { sub: user.id, role: user.role };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
