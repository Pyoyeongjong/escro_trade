import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Product_Img } from "./product-image.entity";
import { Reply } from "src/replies/reply.entity";
import { Liked_Product } from "src/users/entities/liked_product.entity";
import { TransactionEntity } from "src/transactions/transaction.entity";
import { TradeOffer } from "src/trade-offer/trade_offer.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    cost: number;

    @ManyToOne(() => User, user => user.products)
    createdBy: User;

    @ManyToOne(() => User, user => user.buy_list)
    buyer: User;

    @OneToMany(() => Product_Img, image => image.product)
    images: Product_Img[];

    @OneToMany(() => Reply, reply => reply.product)
    replies: Reply[];

    @OneToMany(() => Liked_Product, lp => lp.product)
    liked_users: Liked_Product[];

    @OneToMany(() => TransactionEntity, tx => tx.product)
    transactions: TransactionEntity[];

    @OneToMany(() => TradeOffer, to => to.product)
    trade_offers: TradeOffer[];
}