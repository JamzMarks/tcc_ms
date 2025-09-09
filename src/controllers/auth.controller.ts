import { AuthService } from './../services/auth.service';
import { Body, Controller, Get, Post, Res,Version  } from "@nestjs/common";
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto } from "src/dto/login.dto";
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'generated/prisma';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private jwtService: JwtService) {}
    
    @Post('signin')
    @Version('1')
    @ApiResponse({ status: 200, description: 'Success signin.'})
    async signIn(@Body() loginDto: LoginDto) {
        const payload = await this.authService.signin(loginDto);
        
        const access_token = await this.jwtService.signAsync(payload);

        return {
            user: payload,
            access_token,
        };
    }

    @Version('1')
    @Get('get-cookie')
    async signTest(){
        const user = {
            id: '1',
            email: 'jamzmarks@gmail.com',
            role: Roles.ADMIN
        }
        const payload = { sub: user.id, username: user.email, role: user.role };

        const token = await this.jwtService.signAsync(payload);
        return {
            user: payload,
            access_token: token,
        };
    }

    @Get('test')
    async test(){
        const data ={text: 'Hello World'}
        return data
    }

}