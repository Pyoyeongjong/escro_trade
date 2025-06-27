import { InjectRepository } from "@nestjs/typeorm";
import { TradeOffer } from "./trade_offer.entity";
import { CreateTradeOfferDto } from "./dto/create-trade-offer.dto";
import { User } from "src/users/entities/user.entity";
import { Product } from "src/products/entities/product.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TradeOfferStatus } from "src/types/trade-offer-status";

@Injectable()
export class TradeOfferRepository {
    constructor(
        @InjectRepository(TradeOffer)
        private readonly tradeOfferRepository: Repository<TradeOffer>
    ) { }

    async createTradeOffer(createTradeOfferDto: CreateTradeOfferDto, user: User, product: Product) {
        const tradeOffer = this.tradeOfferRepository.create({
            cost: createTradeOfferDto.cost,
            buyer: user,
            product,
            accepted: TradeOfferStatus.WAITING
        })

        try {
            return await this.tradeOfferRepository.save(tradeOffer);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new TradeOffer");
        }
    }

    async findOne(id: number) {
        const to = await this.tradeOfferRepository.findOne({
            where: { id },
            relations: ['buyer', 'product', 'product.createdBy']
        });
        if (!to)
            throw new NotFoundException(`TradeOffer with ${id} not found`);
        return to;
    }

    async remove(to: TradeOffer) {
        try {
            return await this.tradeOfferRepository.remove(to);
        } catch (error) {
            throw new InternalServerErrorException("Can't remove Trade offer");
        }
    }

    async save(to: TradeOffer) {
        try {
            return await this.tradeOfferRepository.save(to);
        } catch (error) {
            throw new InternalServerErrorException("Can't remove Trade offer");
        }
    }


}