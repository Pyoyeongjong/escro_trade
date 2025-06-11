import { InjectRepository } from "@nestjs/typeorm";
import { TradeOffer } from "./trade_offer.entity";

export class TradeOfferRepository {
    constructor (
        @InjectRepository(TradeOffer)
        private readonly tradeOfferRepository: TradeOfferRepository
    ){}
    
}