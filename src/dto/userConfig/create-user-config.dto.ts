import { ApiProperty } from '@nestjs/swagger';
import { Language, Theme } from 'generated/prisma';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserConfigDto {
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: Language, default: Language.EN })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ enum: Theme, default: Theme.LIGHT })
  @IsEnum(Theme)
  theme: Theme;
}
