import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { LoginDto } from '@app/shared/dtos/auth/login.dto';
import { SignupDto } from '@app/shared/dtos/auth/signup.dto';
import { UserRoleEnum } from '@app/shared/enums/role.enum';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user-service/src/services/user-service.service';
import * as bcrypt from 'bcrypt';
import { firstValueFrom, lastValueFrom, Observable, retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    @Inject(SCORE_SERVICE) private scoreClient: ClientProxy,
  ) {}

  async login(dto: LoginDto) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'getUserByPhone' }, dto.phone),
    );
    console.log('User:', user);

    if (!user) throw new BadRequestException('کاربری با این مشخصات یافت نشد');

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword)
      throw new RpcException({
        message: 'sرمز عبور اشتباه است',
        statusCode: HttpStatus.UNAUTHORIZED,
      });

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
      throw new BadRequestException('این کاربر از قبل وجود دارد');
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
