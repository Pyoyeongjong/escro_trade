import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.replies)
    user: User;

    @ManyToOne(() => Product, product => product.replies)
    product: Product;
}