import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/users/user.repository";
import { TradeOfferRepository } from "./trade_offer.repository";
import { ProductRepository } from "src/products/product.repository";
import { ProductStatus } from "src/types/product-status";
import { TradeOfferStatus } from "src/types/trade-offer-status";
import { Product } from "src/products/entities/product.entity";

@Injectable()
export class TradeOfferService {
    constructor(
        private tradeOfferRepository: TradeOfferRepository,
        private productRepository: ProductRepository,
        private userRepository: UserRepository,
    ) { }

    async refuseTradeOffer(username: string, id: number) {
        const user = await this.userRepository.findOne(username);
        const to = await this.tradeOfferRepository.findOne(id);
        const product = to.product;

        if (product.createdBy.id !== user.id) {
            throw new UnauthorizedException("You have not permission to accept this TO");
        }

        to.accepted = TradeOfferStatus.REFUSED;
        await this.tradeOfferRepository.save(to);

        return {
            message: "refused Ok"
        }
    }

    async acceptTradeOffer(username: string, id: number) {
        const user = await this.userRepository.findOne(username);
        const to = await this.tradeOfferRepository.findOne(id);
        const product = to.product;
        if (product.createdBy.id !== user.id) {
            throw new UnauthorizedException("You have not permission to accept this TO");
        }

        to.accepted = TradeOfferStatus.ACCEPTED;
        await this.tradeOfferRepository.save(to);

        product.status = ProductStatus.MATCHED;
        product.buyer = to.buyer;
        product.cost = to.cost;
        await this.productRepository.saveProduct(product);

        return {
            message: "accepted Ok"
        }
    }

    async removeTradeOffer(username: string, id: number) {
        const user = await this.userRepository.findOne(username);
        const to = await this.tradeOfferRepository.findOne(id);

        const product = to.product;
        if (to.buyer.id !== user.id) {
            throw new UnauthorizedException("You have not permission to remove this TO");
        }

        if (product.status === ProductStatus.FINDING || product.status === ProductStatus.MATCHED) {
            if (product.status === ProductStatus.MATCHED)
                product.status = ProductStatus.FINDING;

            return await this.tradeOfferRepository.remove(to);
        } else {
            throw new ForbiddenException("Can't remove Trade Offer because of product status.");
        }
    }
}