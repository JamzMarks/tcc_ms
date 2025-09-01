import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from 'src/dto/user.dto';
import { RolesGuard } from '@guards/role.guard';
import { Role } from '@decorators/role.decorator';
import { Roles } from 'generated/prisma';


@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Get() findUsers() {
    return this.userService.findUsers();
  }
  @Get('email/:email') findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id') findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Role(Roles.ADMIN)
  @Post() createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id') updateUser(@Param('id') id: string, @Body() userDto: Partial<UserDto>) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id') deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({id});
  }
}
