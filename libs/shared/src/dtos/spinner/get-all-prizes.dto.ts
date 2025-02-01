import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../pagination.dto';
import { PrizeTypeEnum } from '@app/shared/enums/prize.enum';

export class GetAllPrizesByUserDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: PrizeTypeEnum,
  })
  @IsOptional()
  @IsEnum(PrizeTypeEnum)
  @Transform(({ value }) => value.trim())
  type: PrizeTypeEnum;

  @ApiPropertyOptional({ default: 'DESC' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsIn(['ASC', 'DESC'])
  @Type(() => String)
  sort: 'ASC' | 'DESC';

  @ApiPropertyOptional({ default: 'wonAt' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  @IsIn(['wonAt', 'prizeId'])
  sortBy: string;
}
