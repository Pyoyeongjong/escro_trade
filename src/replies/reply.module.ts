import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reply } from "./reply.entity";
import { ReplyService } from "./reply.service";
import { ReplyController } from "./reply.controller";
import { ReplyRepository } from "./reply.repository";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Reply]), AuthModule, UserModule],
    exports: [ReplyRepository],
    providers: [ReplyService, ReplyRepository],
    controllers: [ReplyController]
}) 
export class ReplyModule {}