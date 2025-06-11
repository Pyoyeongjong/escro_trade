import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reply } from "./reply.entity";
import { Repository } from "typeorm";
import { ReplyDto } from "./dto/reply.dto";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class ReplyRepository {
    constructor (
        @InjectRepository(Reply)
        private readonly replyRepository: Repository<Reply>
    ){}

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
}