import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'generated/prisma';
import { AuthGuard } from '@guards/auth.guard';
import { OwnerGuard } from '@guards/Owner.guard';
import { UpdatePasswordDto } from '@dtos/auth/update-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signin')
  @Version('1')
  @ApiResponse({ status: 200, description: 'Success signin.' })
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signin(loginDto);
  }

  @Version('1')
  @Get('get-cookie')
  async signTest() {
    const user = {
      id: '1',
      email: 'jamzmarks@gmail.com',
      role: Roles.ADMIN,
    };
    const payload = { sub: user.id, username: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);
    return {
      user: payload,
      access_token: token,
    };
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePasswordDto, description: 'Current and new password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 401, description: 'Current password incorrect.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Version('1')
  @UseGuards(AuthGuard, OwnerGuard)
  @Post('password/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.authService.updateUserPassword(
      id,
      body.newPassword,
      body.confirmationPassword,
    );
  }

  @Post('refresh')
  @Version('1')
  @ApiResponse({ status: 200, description: 'Refresh access token.' })
  async refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refreshAccessToken(refresh_token);
  }
}
