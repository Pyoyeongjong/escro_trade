import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auto-credential.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { throws } from "assert";

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService){}

    @Post('signup')
    async signup(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('signin')
    async signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string, refreshToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<{accessToken: string}> {

        return this.authService.refreshAccessToken(refreshToken);
    }

    //TODO:
    @Post('findId')
    async findId(){

    }

    @Post('findPw')
    async findPw(){
        
    }


}