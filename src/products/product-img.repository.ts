import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Product_Img } from "./entities/product-image.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import * as path from "path";
import * as fs from 'fs';

@Injectable()
export class ProductImgRepository {
    constructor(
        @InjectRepository(Product_Img)
        private readonly productImgRepository: Repository<Product_Img>
    ) { }

    async createProductImg(imageUrl: string) {
        const productImg = this.productImgRepository.create({
            image_url: imageUrl
        })

        try {
            return await this.productImgRepository.save(productImg);
        } catch (err) {
            throw new InternalServerErrorException("Can't create a new ProductImg")
        }
    }

    async saveProductImg(productImg: Product_Img) {
        try {
            return await this.productImgRepository.save(productImg);
        } catch (err) {
            throw new InternalServerErrorException("Can't create a new ProductImg")
        }
    }

    async removeProductImg(productImg: Product_Img) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', productImg.image_url);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        })
        await this.productImgRepository.remove(productImg);

    }
}