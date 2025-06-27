import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auto-credential.dto";
import { MyAuthGuard } from "./auth.guard";
import { Request } from "express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        console.log(authCredentialsDto);
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('signin')
    async signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
        console.log(authCredentialsDto);
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {

        return this.authService.refreshAccessToken(refreshToken);
    }

    @Get('verifyAccessToken')
    @UseGuards(MyAuthGuard)
    async verifyAccessToken(
        @Req() req: Request
    ) {
        console.log(req);
        return req.user ? req.user : null;
    }

    //TODO:
    @Post('findId')
    async findId() {

    }

    @Post('findPw')
    async findPw() {

    }


}