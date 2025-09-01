import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'generated/prisma';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-gerado' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ enum: Roles, example: Roles.USER })
  role: Roles;

  @ApiProperty({ example: '2025-08-27T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-27T20:05:00.000Z' })
  updatedAt: Date;
}
