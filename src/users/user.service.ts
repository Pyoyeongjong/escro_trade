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
import { UpdateLocationDto } from "./dto/update-user.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async updateUserLocation(username: string, updateLocationDto: UpdateLocationDto) {
        const user = await this.userRepository.findOne(username);
        if (!user)
            throw new NotFoundException("User not found");
        user.location = updateLocationDto.location;

        await this.userRepository.saveUser(user);
        return {
            message: 'Update Location successfully',
        }
    }

    async updateUserWallet(username: string, updateWalletDto: UpdateWalletDto) {
        const user = await this.userRepository.findOne(username);
        if (!user)
            throw new NotFoundException("User not found");
        user.wallet = updateWalletDto.wallet;

        await this.userRepository.saveUser(user);
        return {
            message: 'Update Wallet Address successfully',
        }
    }


    async getUserByToken(username: string) {
        const user = await this.userRepository.findOne(username);
        if (!user)
            throw new NotFoundException("User not found");
        return instanceToPlain(user);
    }
}