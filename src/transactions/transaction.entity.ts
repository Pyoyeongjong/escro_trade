import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tx_type: string;

    @Column()
    status: string;

    @Column()
    tx_hash: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.transactions)
    user: User;

    @ManyToOne(() => Product, product => product.transactions)
    product: Product

}