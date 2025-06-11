import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Liked_Product } from "./entities/liked_product.entity";
import { UserRepository } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotFoundError } from "rxjs";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async modifyWalletAddr(accessToken: string, walletAddr: string) {
        const username = this.username_from_accessToken(accessToken);
        const user = await this.userRepository.findOne(username);
        if (!user)
            throw new NotFoundException("User not found");

        user.wallet = walletAddr;
        return {
            message: 'Modify Wallet Address successfully',
        }
    }

    async getUserByName(username: string) {
        const user = await this.userRepository.findOne(username);
        if (!user)
            throw new NotFoundException("User not found");
        return instanceToPlain(user);
    }
    

    username_from_accessToken(accessToken: string) {
        const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret"
        })
        return payload.username;
    }
}