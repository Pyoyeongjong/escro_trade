import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TradeOffer } from "./trade_offer.entity";
import { Repository } from "typeorm";

@Injectable()
export class TradeOfferService {
    constructor(
        @InjectRepository(TradeOffer)
        private tradeOfferRepository: Repository<TradeOffer>
    ) {}
}