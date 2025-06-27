import { Product } from "src/products/entities/product.entity";
import { Reply } from "src/replies/reply.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Liked_Product } from "./liked_product.entity";
import { TransactionEntity } from "src/transactions/transaction.entity";
import { TradeOffer } from "src/trade-offer/trade_offer.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refreshToken: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    wallet: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Product, product => product.createdBy)
    products: Product[];

    @OneToMany(() => Product, product => product.buyer)
    buy_list: Product[];

    @OneToMany(() => Reply, reply => reply.user)
    replies: Reply[];

    @OneToMany(() => Liked_Product, lp => lp.user)
    liked_products: Liked_Product[];

    @OneToMany(() => TransactionEntity, tx => tx.user)
    transactions: TransactionEntity[];

    @OneToMany(() => TradeOffer, to => to.buyer)
    trade_offers: TradeOffer[];
}