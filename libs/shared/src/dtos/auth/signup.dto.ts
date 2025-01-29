import { UserEntity } from '@app/shared/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class SignupDto extends PickType(UserEntity, [
  'phone',
  'password',
] as const) {}
