import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
