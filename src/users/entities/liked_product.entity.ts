import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class Liked_Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User

    @ManyToOne(() => Product)
    product: Product

}