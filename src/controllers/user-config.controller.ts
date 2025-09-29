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
import { UserDto } from 'src/dto/user.dto';
import { RolesGuard } from '@guards/role.guard';
import { AuthGuard } from '@guards/auth.guard';
import { OwnerGuard } from '@guards/Owner.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserConfigService } from '@services/userConfig.service';
import { UserConfigDto } from '@dtos/userConfig/user-config.dto';

@ApiTags('Users-config')
@ApiBearerAuth()
@UseGuards(RolesGuard, AuthGuard, OwnerGuard)
@Controller('Users-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}

  @ApiOperation({ summary: 'Get user config by user Id' })
  @ApiParam({ name: 'userId', type: String, description: 'User Id' })
  @ApiResponse({ status: 200, description: 'Return user config.' })
  @ApiResponse({ status: 404, description: 'User config not found.' })
  @Version('1')
  @Get('u/:id')
  fingUserConfigByUser(@Param('id') id: string) {
    return this.userConfigService.fingUserConfigByUser(id);
  }

  @ApiOperation({ summary: 'Update an existing user config by user Id' })
  @ApiParam({ name: 'id', type: String, description: 'User Id' })
  @ApiBody({ type: UserConfigDto, description: 'User config fields to update' })
  @ApiResponse({
    status: 200,
    description: 'User config updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @Patch(':id/config')
  updateUserConfigByUserId(
    @Param('id') id: string,
    @Body() dto: Partial<UserConfigDto>,
  ) {
    return this.userConfigService.updateUserConfigByUserId(id, dto);
  }
}
