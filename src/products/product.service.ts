import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";
import { ProductImgRepository } from "./product-img.repository";
import { UserRepository } from "src/users/user.repository";
import { ReplyDto } from "src/replies/dto/reply.dto";
import { ReplyRepository } from "src/replies/reply.repository";
import { CreateTradeOfferDto } from "src/trade-offer/dto/create-trade-offer.dto";
import { TradeOfferRepository } from "src/trade-offer/trade_offer.repository";
import { instanceToPlain } from "class-transformer";
import { UpdateProductStatusDto } from "./dto/update-product-status.dto";
import { ProductStatus } from "src/types/product-status";

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private productImgRepository: ProductImgRepository,
        private userRepository: UserRepository,
        private replyRepository: ReplyRepository,
        private tradeOfferRepository: TradeOfferRepository
    ) { }

    async updateProductStatusByTx(productId: number, status: ProductStatus) {
        const validTransition: Record<string, string[]> = {
            finding: ["matched", "canceled"],
            matched: ["pending", "canceled"],
            pending: ["processing", "canceled"],
            processing: ["shipping", "canceled"],
            shipping: ["finished", "canceled"],
            finished: []
        }

        const product = await this.productRepository.findById(productId);
        const nextStatus = status;

        if (!validTransition[product.status].includes(nextStatus)) {
            throw new ForbiddenException("Invalid status transition by tx");
        }

        product.status = nextStatus;
        await this.productRepository.saveProduct(product);
    }

    async updateProductStatus(username: string, productId: number, updateProductStatusDto: UpdateProductStatusDto) {

        const validTransition: Record<string, string[]> = {
            finding: ["matched", "canceled"],
            matched: ["pending", "canceled"],
            pending: ["processing", "canceled"],
            processing: ["shipping", "canceled"],
            shipping: ["finished", "canceled"],
            finished: []
        }
        const user = await this.userRepository.findOne(username);
        const product = await this.productRepository.findById(productId);

        if (user.id !== product.createdBy.id) {
            throw new ForbiddenException("Can't update this product status");
        }
        const nextStatus = updateProductStatusDto.status;
        if (!validTransition[product.status].includes(nextStatus)) {
            throw new BadRequestException(`Invalid status transition: ${product.status} -> ${nextStatus}`);
        }

        product.status = nextStatus;
        await this.productRepository.saveProduct(product);
        return {
            message: "Updated Product Status Successfully."
        }

    }

    // TODO: 굳이 게시자 본인만 확인할 필요 없지 않을까 싶음
    // 다른 사용자도 효율적인 가격 비교를 위해 확인할 피요 있을 것 같음
    async getProductsTo(username: string, productId: number) {
        const product = await this.productRepository.findById(productId);
        return product.trade_offers;
    }

    async createTradeOffer(createTradeOfferDto: CreateTradeOfferDto, username: string, productId: number) {
        const user = await this.userRepository.findOne(username);
        const product = await this.productRepository.findById(productId);

        const tradeOffer = await this.tradeOfferRepository.createTradeOffer(createTradeOfferDto, user, product);

        return {
            message: 'Offer added successfully',
            replyId: tradeOffer.id
        }
    }

    async getPaginatedProducts(page: number, limit: number) {
        return await this.productRepository.findAndCount(page, limit);
    }

    async getProduct(productId: number) {
        return instanceToPlain(this.productRepository.findById(productId));
    }

    async addReply(replyDto: ReplyDto, productId: number, username: string) {
        const user = await this.userRepository.findOne(username);
        const product = await this.productRepository.findById(productId);

        const reply = await this.replyRepository.createReply(replyDto, product, user);

        return {
            message: 'Reply added successfully',
            replyId: reply.id
        }
    }

    async removeProduct(username: string, productId: number) {
        const user = await this.userRepository.findOne(username);
        const product = await this.productRepository.findById(productId);

        if (product.createdBy.id !== user.id) {
            throw new UnauthorizedException("You have not authorization in this product");
        }

        console.log("hello");

        for (const img of product.images) {
            await this.productImgRepository.removeProductImg(img);
        }

        for (const reply of product.replies) {
            await this.replyRepository.removeReply(reply);
        }

        for (const trade_offer of product.trade_offers) {
            await this.tradeOfferRepository.remove(trade_offer);
        }

        return await this.productRepository.removeProduct(product);
    }

    async saveProduct(createProductDto: CreateProductDto, username: string, imageUrls: string[]) {

        const user = await this.userRepository.findOne(username);

        const product = await this.productRepository.createProduct(createProductDto, user);

        for (const imageUrl of imageUrls) {
            const productImg = await this.productImgRepository.createProductImg(imageUrl);
            productImg.product = product;
            console.log(imageUrl);
            product.images.push(productImg);
            await this.productImgRepository.saveProductImg(productImg);
        }

        await this.productRepository.saveProduct(product);

        return {
            message: 'Successfully created New Product',
            productId: product.id
        }
    }

    async updateProduct(id: number, createProductDto: CreateProductDto, username: string, imageUrls: string[]) {
        const product = await this.productRepository.findById(id);
        const user = await this.userRepository.findOne(username);

        if (product?.createdBy !== user) {
            throw new UnauthorizedException("This product can't be updated by you.")
        }

        await Promise.all(product.images.map(image => {
            this.productImgRepository.removeProductImg(image);
        }))

        product.images = [];
        product.title = createProductDto.title;
        product.description = createProductDto.description;
        product.cost = createProductDto.cost;

        for (const imageUrl of imageUrls) {
            const productImg = await this.productImgRepository.createProductImg(imageUrl);
            productImg.product = product;
            product.images.push(productImg);
            await this.productImgRepository.saveProductImg(productImg);
        }

        await this.productRepository.saveProduct(product);
        return {
            message: 'Successfully updated New Product',
            productId: product.id
        }
    }
}