import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from 'src/dto/user.dto';
import { RolesGuard } from '@guards/role.guard';
import { Role } from '@decorators/role.decorator';
import { Roles } from 'generated/prisma';
import { AuthGuard } from '@guards/auth.guard';
import { OwnerOrAdminGuard } from '@guards/OwnerOrAdmin.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserConfigService } from '@services/userConfig.service';
import { CreateUserConfigDto } from '@dtos/userConfig/create-user-config.dto';
import { UserConfigDto } from '@dtos/userConfig/user-config.dto';

@ApiTags('Users-config')
// @ApiBearerAuth()         // Indica que precisa de token
// @UseGuards(AuthGuard, RolesGuard)
@UseGuards(RolesGuard)
@Controller('Users-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}

  @ApiOperation({ summary: 'Get user config by Id' })
  @ApiParam({ name: 'id', type: String, description: 'Config Id' })
  @ApiResponse({ status: 200, description: 'Return a list of users.' })
  @Version('1')
  @Get(':id')
  async findUsers(@Param('id') id: string) {
    return this.userConfigService.fingUserConfig(id);
  }

  @ApiOperation({ summary: 'Get user config by user Id' })
  @ApiParam({ name: 'userId', type: String, description: 'User Id' })
  @ApiResponse({ status: 200, description: 'Return user config.' })
  @ApiResponse({ status: 404, description: 'User config not found.' })
  @Version('1')
  @Get('u/:userId')
  findUserById(@Param('userId') userId: string) {
    return this.userConfigService.fingUserConfigByUser(userId);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserConfigDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Email already in use.' })
  @Version('1')
  @Role(Roles.ADMIN)
  @Post()
  createUser(@Body() dto: CreateUserConfigDto) {
    return this.userConfigService.createUserConfig(dto);
  }

  @ApiOperation({ summary: 'Update an existing user config' })
  @ApiParam({ name: 'id', type: String, description: 'User Id' })
  @ApiBody({ type: UserDto, description: 'User fields to update' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: Partial<UserConfigDto>) {
    return this.userConfigService.updateUserConfig(id, dto);
  }

}
