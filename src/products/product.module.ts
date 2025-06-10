import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Product_Img } from "./entities/product-image.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { AuthModule } from "src/auth/auth.module";
import { ProductRepository } from "./product.repository";
import { ProductImgRepository } from "./product-img.repository";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]), 
        TypeOrmModule.forFeature([Product_Img]),
        // Jwt 기능이 AuthModule에 정의되어 있기 때문에 AUthGuard를 사용하기 위해선 AUthModule을
        // import 해야한다.
        AuthModule,
        ConfigModule,
        UserModule
    ],
    providers: [ProductService, ProductRepository, ProductImgRepository],
    controllers: [ProductController]
}) 
export class ProductModule {}