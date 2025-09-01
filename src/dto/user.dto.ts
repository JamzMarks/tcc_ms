import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'generated/prisma';

export class UserDto {
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

}
