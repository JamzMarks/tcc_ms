import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'generated/prisma';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
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

  @ApiProperty({ example: 'path' })
   avatar?: string | null;
}
