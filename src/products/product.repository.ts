import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class ProductRepository {
    constructor (
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async createProduct(createProductDto: CreateProductDto, user: User) {
        const { title, description, cost } = createProductDto;

        const product = this.productRepository.create({
            title,
            description,
            cost,
            createdBy: user,
            status: 'finding',
            images: [],
            replies: [],
            liked_users: [],
            transactions: [],
            trade_offers: []
        })

        try {
            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new Product")
        }
    }

    async saveProduct(product: Product) {
        try {
            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new Product")
        }
    }
}