import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reply } from "./reply.entity";
import { Repository } from "typeorm";
import { ReplyDto } from "./dto/reply.dto";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { userInfo } from "os";

@Injectable()
export class ReplyRepository {
    constructor (
        @InjectRepository(Reply)
        private readonly replyRepository: Repository<Reply>
    ){}

    async findAndCount(productId: number, page: number, limit: number) {
        const [data, total] = await this.replyRepository.findAndCount({
            where: { product: {id: productId}},
            skip: (page - 1) * limit,
            take: limit,
            order: {created_at: 'DESC'}
        })

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }
    }

    async createReply(replyDto: ReplyDto, product: Product, user: User) {
        const { description } = replyDto;

        const reply = this.replyRepository.create({
            description: description,
            user,
            product
        });

        try {
            return await this.replyRepository.save(reply);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new Reply")
        }
    }

    async saveReply(reply: Reply) {
        try {
            return await this.replyRepository.save(reply);
        } catch (error) {
            throw new InternalServerErrorException("Can't save the Reply")
        }
    }

    async removeReply(reply: Reply) {
        try {
            return await this.replyRepository.remove(reply);
        } catch (error) {
            throw new InternalServerErrorException("Can't remove the Reply")
        }
    }

    async findById(id: number): Promise<Reply> {
        const reply = await this.replyRepository.findOne({
            where: {id},
            relations: [ 'user', 'product' ]
        })
        if (!reply) {
            throw new NotFoundException(`Reply with id ${id} not found`);
        }
        return reply;
    }
}