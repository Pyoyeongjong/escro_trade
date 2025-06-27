import { userInfo } from "os";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class TradeOffer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cost: number;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    accepted: string;

    @ManyToOne(() => User, user => user.trade_offers)
    buyer: User;

    @ManyToOne(() => Product, product => product.trade_offers)
    product: Product;
}