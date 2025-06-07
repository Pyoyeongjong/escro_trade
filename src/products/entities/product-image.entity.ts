import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

export class Product_Img {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image_url: string;

    @ManyToOne(() => Product)
    product: Product;
}