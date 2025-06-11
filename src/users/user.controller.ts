import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { getAccessToken } from "src/commom/utils/auth.utils";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('user')
export class UserController {

    constructor (private userService: UserService) {}

    @Post('modifyWalletAddr')
    @UseGuards(AuthGuard())
    async modifyWalletAddr(
        @Req() req: Request,
        @Body(ValidationPipe) walletAddr: string,
    ){
        const accessToken = getAccessToken(req);
        if (!accessToken)
            throw new UnauthorizedException("Unauthorized User");

        return this.userService.modifyWalletAddr(accessToken, walletAddr);
    }

    @Get('getUser/:username')
    async getUser(
        @Param('username') username: string
    ){
        const user = await this.userService.getUserByName(username);
        return user;
    }

    //TODO: 
    @Post('update/:username')
    async updateUser(
        @Param('username') username: string,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ){

    }
}