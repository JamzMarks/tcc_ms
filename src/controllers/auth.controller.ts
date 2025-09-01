import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "src/dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('signin')
    async signIn(@Body() loginDto: LoginDto) {
        return this.authService.signin(loginDto);
    }
}