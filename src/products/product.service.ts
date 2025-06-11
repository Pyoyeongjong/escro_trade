import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { ReplyDto } from "src/replies/dto/reply.dto";
import { ReplyRepository } from "src/replies/reply.repository";
import { repl } from "@nestjs/core";

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private productImgRepository: ProductImgRepository,
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
        private replyRepository: ReplyRepository
    ) {}

    async addReply(replyDto: ReplyDto, productId: number, accessToken: string) {
        const username = this.username_from_accessToken(accessToken);
        const user = await this.userRepository.findOne(username);
        const product = await this.productRepository.findById(productId);

        const reply = await this.replyRepository.createReply(replyDto, product, user);

        return {
            message: 'Reply added successfully',
            replyId: reply.id
        }
    }

    async saveProduct(createProductDto: CreateProductDto, accessToken: string, imageUrls: string[]){

        const username = this.username_from_accessToken(accessToken);
        const user = await this.userRepository.findOne(username);

        const product = await this.productRepository.createProduct(createProductDto, user);

        for (const imageUrl of imageUrls) {
            const productImg = await this.productImgRepository.createProductImg(imageUrl);
            productImg.product = product;
            product.images.push(productImg);
            await this.productImgRepository.saveProductImg(productImg);
        }

        await this.productRepository.saveProduct(product);
        
        return {
            message: 'Successfully created New Product',
            productId: product.id
        }
    }

    async updateProduct(id: number, createProductDto: CreateProductDto, accessToken: string, imageUrls: string[]) {
        const username = this.username_from_accessToken(accessToken);
        const product = await this.productRepository.findById(id);
        const user = await this.userRepository.findOne(username);

        if (product?.createdBy !== user) {
            throw new UnauthorizedException("This product can't be updated by you.")
        }

        await Promise.all(product.images.map(image => {
            this.productImgRepository.removeProductImg(image);
        }))

        product.images = [];
        product.title = createProductDto.title;
        product.description = createProductDto.description;
        product.cost = createProductDto.cost;

        for (const imageUrl of imageUrls) {
            const productImg = await this.productImgRepository.createProductImg(imageUrl);
            productImg.product = product;
            product.images.push(productImg);
            await this.productImgRepository.saveProductImg(productImg);
        }

        await this.productRepository.saveProduct(product);
        return {
            message: 'Successfully updated New Product',
            productId: product.id
        }
    }

    username_from_accessToken(accessToken: string) {
        const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret"
        })
        return payload.username;
    }
}