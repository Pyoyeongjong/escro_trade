import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ReplyService } from "./reply.service";
import { getAccessToken } from "src/commom/utils/auth.utils";
import { ReplyDto } from "./dto/reply.dto";
import { Request } from "express";
import { MyAuthGuard } from "src/auth/auth.guard";

@Controller('reply')
export class ReplyController {

    constructor(private replyService: ReplyService) { }

    //TODO:
    @Post('update/:id')
    @UseGuards(MyAuthGuard)
    updateReply(
        @Param('id') id: number,
        @Req() req: Request,
        @Body() replyDto: ReplyDto
    ) {
        const username = req.user!.username;
        return this.replyService.updateReply(replyDto, username, id);
    }

    @Post('remove/:id')
    @UseGuards(MyAuthGuard)
    removeReply(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        const username = req.user!.username;
        return this.replyService.removeReply(username, id);
    }

    // 페이징 처리 해야한다!
    @Get(':productId/getReplies')
    async getReplies(
        @Param('productId', ParseIntPipe) productId: number,
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.replyService.getPaginatedReplies(productId, page, limit);
    }
}