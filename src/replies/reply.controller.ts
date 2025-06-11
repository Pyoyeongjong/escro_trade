import { Controller, Post } from "@nestjs/common";
import { ReplyService } from "./reply.service";

@Controller('reply')
export class ReplyController {
    
    constructor (private replyService: ReplyService) {}

    //TODO:
    @Post('update/:id')
    updateReply() {

    }

    @Post('remove/:id')
    removeReply() {

    }
}