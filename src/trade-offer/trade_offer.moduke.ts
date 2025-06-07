import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradeOffer } from "./trade_offer.entity";
import { TradeOfferService } from "./trade_offer.service";
import { TradeOfferController } from "./trade_offer.controller";

@Module({
    imports: [TypeOrmModule.forFeature([TradeOffer])],
    providers: [TradeOfferService],
    controllers: [TradeOfferController]
})
export class TradeOfferModule {}