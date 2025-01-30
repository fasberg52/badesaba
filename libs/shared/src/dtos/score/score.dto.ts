import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ScoreUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  score: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
