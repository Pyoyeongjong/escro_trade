import { Controller, Get, Post } from "@nestjs/common";
import { TradeOfferService } from "./trade_offer.service";

@Controller('trade-offer')
export class TradeOfferController {
    constructor (
        private tradeOfferService: TradeOfferService
    ){}

    //TODO:
    @Post('update/:id')
    updateTradeOffer() {

    }

    @Post('remove/:id')
    removeTradeOffer() {

    }

    @Get('get/:id')
    getTradeOffer() {
        
    }
}