import { Controller, Get, Param, ParseIntPipe, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { TradeOfferService } from "./trade_offer.service";
import { getAccessToken } from "src/commom/utils/auth.utils";
import { access } from "fs";
import { MyAuthGuard } from "src/auth/auth.guard";
import { Request } from "express";

@Controller('trade-offer')
export class TradeOfferController {
    constructor(
        private tradeOfferService: TradeOfferService
    ) { }

    //TODO:
    @Post('update/:id')
    @UseGuards(MyAuthGuard)
    updateTradeOffer() {

    }

    @Post('refuse/:id')
    @UseGuards(MyAuthGuard)
    refuseTradeOffer(
        @Req() req: Request,
        @Param("id", ParseIntPipe) id: number
    ) {
        const username = req.user!.username;
        return this.tradeOfferService.refuseTradeOffer(username, id);
    }

    @Post('accept/:id')
    @UseGuards(MyAuthGuard)
    acceptTradeOffer(
        @Req() req: Request,
        @Param("id", ParseIntPipe) id: number
    ) {
        const username = req.user!.username;
        return this.tradeOfferService.acceptTradeOffer(username, id);
    }

    @Post('remove/:id')
    @UseGuards(MyAuthGuard)
    removeTradeOffer(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number
    ) {
        const username = req.user!.username;
        return this.tradeOfferService.removeTradeOffer(username, id);
    }
}