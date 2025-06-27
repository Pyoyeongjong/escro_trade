import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Auth, Repository } from "typeorm";
import { Liked_Product } from "src/users/entities/liked_product.entity";
import { AuthCredentialsDto } from "./dto/auto-credential.dto";
import { UserRepository } from "../users/user.repository";
import { stringify } from "querystring";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { ConfigService } from "@nestjs/config";
import { throws } from "assert";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        return await this.userRepository.createUser(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string,
        refreshToken: string
    }> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { username };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('jwt.refresh_secret') ?? "refresh_secret",
                expiresIn: '7d',
            });

            await this.userRepository.updateRefreshToken(username, refreshToken);

            return { accessToken, refreshToken };
        } else {
            throw new UnauthorizedException('Login failed')
        }
    }

    async verifyAccessToken(accessToken: string) {
        try {
            this.jwtService.verify(accessToken, {
                secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret",
            })
        } catch (err) {
            throw new UnauthorizedException("Acceess Token expired or invalid");
        }

        const username = this.username_from_accessToken(accessToken);
        return { isVerify: true, username: username };
    }

    async refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string
    }> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('jwt.refresh_secret') ?? "refresh_secret",
            })

            const user = await this.userRepository.findOne(payload.username);

            if (user.refreshToken !== refreshToken)
                throw new ForbiddenException("Invalid refresh Token");

            const new_payload = { username: payload.username };
            const accessToken = this.jwtService.sign(new_payload);
            return { accessToken };
        } catch (err) {
            throw new ForbiddenException("Refresh Token expired or invalid");
        }
    }

    username_from_accessToken(accessToken: string) {
        const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret"
        })
        return payload.username;
    }
}