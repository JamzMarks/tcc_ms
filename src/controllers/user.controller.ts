import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Version } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from 'src/dto/user.dto';
import { RolesGuard } from '@guards/role.guard';
import { Role } from '@decorators/role.decorator';
import { Roles } from 'generated/prisma';
import { AuthGuard } from '@guards/auth.guard';
import { OwnerOrAdminGuard } from '@guards/OwnerOrAdmin.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get() findUsers() {
    return this.userService.findUsers();
  }
  @Version('1')
  @Get('email/:email') findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  @Version('1')
  @Get(':id') findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
  @Version('1')
  @Role(Roles.ADMIN)
  @Post() createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Version('1')
  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Patch(':id') updateUser(@Param('id') id: string, @Body() userDto: Partial<UserDto>) {
    return this.userService.updateUser(id, userDto);
  }
  
  @Version('1')
  @Role(Roles.ADMIN)
  @Delete(':id') deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({id});
  }
}
