import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Liked_Product } from "./entities/liked_product.entity";
import { UserRepository } from "./user.repository";
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        TypeOrmModule.forFeature([Liked_Product]),
        forwardRef(() => AuthModule)
    ],
    exports: [UserRepository],
    providers: [UserService, UserRepository],
    controllers: [UserController],
})
export class UserModule {}