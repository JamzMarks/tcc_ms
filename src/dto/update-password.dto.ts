import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'NewStrongPassword123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
