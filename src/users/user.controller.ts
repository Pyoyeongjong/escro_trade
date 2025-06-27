import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { getAccessToken } from "src/commom/utils/auth.utils";
import { UserService } from "./user.service";
import { UpdateLocationDto } from "./dto/update-user.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { Request } from "express";
import { MyAuthGuard } from "src/auth/auth.guard";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }


    // 마이페이지용
    @Get('getUser')
    @UseGuards(MyAuthGuard)
    async getUser(
        @Req() req: Request,
    ) {
        const username = req.user!.username;
        return await this.userService.getUserByToken(username);
    }

    @Post('updateLocation')
    @UseGuards(MyAuthGuard)
    async updateUserLocation(
        @Req() req: Request,
        @Body(ValidationPipe) updateLocationDto: UpdateLocationDto
    ) {
        const username = req.user!.username;
        return await this.userService.updateUserLocation(username, updateLocationDto);
    }

    @Post('updateWallet')
    @UseGuards(MyAuthGuard)
    async updateUserWallet(
        @Req() req: Request,
        @Body(ValidationPipe) updateWalletDto: UpdateWalletDto
    ) {
        const username = req.user!.username;
        return await this.userService.updateUserWallet(username, updateWalletDto);
    }
}