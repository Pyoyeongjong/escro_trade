import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reply } from "./reply.entity";
import { Repository } from "typeorm";
import { ReplyDto } from "./dto/reply.dto";
import { ReplyRepository } from "./reply.repository";
import { access } from "fs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "src/users/user.repository";

@Injectable()
export class ReplyService {
    constructor(
        private replyRepository: ReplyRepository,
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,

    ) { }

    async getPaginatedReplies(productId: number, page: number, limit: number) {
        return await this.replyRepository.findAndCount(productId, page, limit);
    }

    async updateReply(replyDto: ReplyDto, username: string, replyId: number) {
        const user = await this.userRepository.findOne(username);
        const reply = await this.replyRepository.findById(replyId);

        if (reply.user.id !== user.id) {
            throw new UnauthorizedException("This reply is not yours");
        }

        reply.description = replyDto.description;
        await this.replyRepository.saveReply(reply);

        return {
            message: 'Reply updated successfully',
            replyId: reply.id
        }
    }

    async removeReply(username: string, replyId: number) {
        const user = await this.userRepository.findOne(username);
        const reply = await this.replyRepository.findById(replyId);

        if (reply.user.id !== user.id) {
            throw new UnauthorizedException("This reply is not yours");
        }

        await this.replyRepository.removeReply(reply);

        return {
            message: 'Reply removed successfully',
        }
    }
}