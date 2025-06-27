import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradeOffer } from "./trade_offer.entity";
import { TradeOfferService } from "./trade_offer.service";
import { TradeOfferController } from "./trade_offer.controller";
import { TradeOfferRepository } from "./trade_offer.repository";
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/users/user.module";
import { ProductModule } from "src/products/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([TradeOffer])
        , AuthModule, ConfigModule, UserModule,
    forwardRef(() => ProductModule)
    ],
    exports: [TradeOfferRepository],
    providers: [TradeOfferService, TradeOfferRepository],
    controllers: [TradeOfferController]
})
export class TradeOfferModule { }