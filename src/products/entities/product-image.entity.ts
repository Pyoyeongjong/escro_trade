import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Product_Img {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image_url: string;

    @ManyToOne(() => Product, product => product.images )
    product: Product;
}