import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'generated/prisma';

export class UserDto {
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

  @ApiProperty({ required: false, example: 'avatar.jpg', description: 'URL do avatar do usuário' })
  avatar: string;

}
