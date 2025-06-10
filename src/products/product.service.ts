import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { Product_Img } from "./entities/product-image.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";
import { ProductImgRepository } from "./product-img.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "src/users/user.repository";
import { User } from "src/users/entities/user.entity";
import { NotFoundError } from "rxjs";

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private productImgRepository: ProductImgRepository,
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async saveProduct(createProductDto: CreateProductDto, accessToken: string, imageUrls: string[]){
        const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret"
        })
        const username = payload.username;
        const user = await this.userRepository.findOne(username);
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const product = await this.productRepository.createProduct(createProductDto, user);

        for (const imageUrl of imageUrls) {
            const productImg = await this.productImgRepository.createProductImg(imageUrl);
            productImg.product = product;
            product.images.push(productImg);
            await this.productImgRepository.saveProductImg(productImg);
        }

        await this.productRepository.saveProduct(product);
        
        return {
            createProductDto,
            imageUrls
        }
    }
}