import { UserEntity } from '@app/shared/entities/user.entity';
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignupDto extends PickType(UserEntity, [
  'phone',
  'password',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referralCode?: string;
}
