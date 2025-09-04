import { AuthService } from './../services/auth.service';
import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto } from "src/dto/login.dto";
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'generated/prisma';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private jwtService: JwtService) {}
    
    @Post('signin')
    @ApiResponse({ status: 200, description: 'Success signin.'})
    async signIn(@Body() loginDto: LoginDto, @Res() res: Response) {
        const token = await this.authService.signin(loginDto);
        
        res.cookie('access_token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 1000 * 60 * 60, // 1 hora
        });


        return res.send({ message: 'Login realizado com sucesso!' });
    }

    @Get('test')
    async signTest(@Res() res: Response){
        const user = {
            id: '1',
            email: 'jamzmarks@gmail.com',
            role: Roles.ADMIN
        }
        const payload = { sub: user.id, username: user.email, role: user.role };

        const token = await this.jwtService.signAsync(payload);

        res.cookie('access_token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 1000 * 60 * 60,
        });
        return res.send({ message: 'ok!' });
    }
}