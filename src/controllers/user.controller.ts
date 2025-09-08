import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Version } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from 'src/dto/user.dto';
import { RolesGuard } from '@guards/role.guard';
import { Role } from '@decorators/role.decorator';
import { Roles } from 'generated/prisma';
import { AuthGuard } from '@guards/auth.guard';
import { OwnerOrAdminGuard } from '@guards/OwnerOrAdmin.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody} from '@nestjs/swagger';

@ApiTags('Users')        // Nome do grupo no Swagger
@ApiBearerAuth()         // Indica que precisa de token
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Return a list of users.' })
  @Version('1')
  @Get() async findUsers() {
    return this.userService.findUsers();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @Get('email/:email') findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User email' })
  @ApiResponse({ status: 200, description: 'Return user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @Get(':id') findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Email already in use.' })
  @Version('1')
  @Role(Roles.ADMIN)
  @Post() createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UserDto, description: 'User fields to update' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Patch(':id') updateUser(@Param('id') id: string, @Body() userDto: Partial<UserDto>) {
    return this.userService.updateUser(id, userDto);
  }
  
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @Role(Roles.ADMIN)
  @Delete(':id') deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Get all available roles' })
  @ApiResponse({ status: 200, description: 'Return list of roles.' })
  @Version('1')
  @Get('roles/list') getRoles() {
    return this.userService.getUsersRoles();
  }
}
