import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Liked_Product } from "src/users/entities/liked_product.entity";
import { UserRepository } from "../users/user.repository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        // JWT 기본옵션
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.access_secret'),
                signOptions: {
                    expiresIn: '1h'
                }
            })
        }),
        PassportModule.register({defaultStrategy: 'jwt'}),
        ConfigModule,
        UserModule
    ],
    exports: [JwtStrategy, PassportModule, JwtModule],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}