import {
  IsOptional,
  IsString,
  IsBoolean,
  IsPositive,
  IsInt,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Roles } from 'generated/prisma';

export class UsersFilters {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return value.toUpperCase();
  })
  @IsEnum(Roles)
  role?: Roles;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  limit: number = 20;
}
