import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    async findAndCount(page: number, limit: number) {
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
            relations: ["images"]
        })
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }
    }

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

    async removeProduct(product: Product) {
        try {
            return await this.productRepository.remove(product);
        } catch (error) {
            throw new InternalServerErrorException("Can't remove the Product")
        }
    }

    async saveProduct(product: Product) {
        try {
            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException("Can't save the Product")
        }
    }

    async findById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ["createdBy", "buyer", "images", "replies", "replies.user", "liked_users", "transactions", "trade_offers", "trade_offers.buyer"]
        })
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }
}