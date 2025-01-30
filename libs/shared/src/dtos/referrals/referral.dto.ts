import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReferralDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  referredUserId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  referralCode: string;
}
