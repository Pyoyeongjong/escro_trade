import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Product_Img } from "./entities/product-image.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([Product_Img])],
    providers: [ProductService],
    controllers: [ProductController]
}) 
export class ProductModule {}