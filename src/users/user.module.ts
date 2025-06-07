import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Liked_Product } from "./entities/liked_product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Liked_Product])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}